import fs from 'fs'
import { Bookmark } from "../models/bookmarks.model.js";
import { Category } from "../models/category.model.js"
import { BadRequestError, NotFoundError } from "../errors/index.js"
import { Settings } from "../models/settings.model.js";
import cloudinary from "../config/cloudinary.js"
import { Parser } from "json2csv";

const parser = new Parser();

const createBookmark = async (req, res, next) => {
    const { title, description, rating, url, category, isFavorite } = req.body

    // Validate
    if (!title || !url) {
        throw new BadRequestError('Title or Url is required')
    }

    // In the case where we have a default rating / category in settings
    const settings = await Settings.findOne({
        user: req.currentUser._id
    });

    const bookmark = await Bookmark.create({
        title,
        description,
        url,
        isFavorite,
        logo: req.file
            ? {
                  url: req.file.path,
                  publicId: req.file.filename
              }
            : undefined,
        category:
            category?.length > 0
                ? category : settings?.defaultCategory ? [settings.defaultCategory] : [],
        rating: rating ?? settings?.defaultRating,
        user: req.currentUser._id

    });

    res.status(201).json({message: "Bookmark created successfully", bookmark});

}


const updateBookmark = async (req, res, next) => {
    const { id } = req.params;

    const bookmark = await Bookmark.findOne({
        _id: id,
        user: req.currentUser._id
    });

    if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    const updateData = {
        ...req.body
    };

    if (req.body.category) {
        updateData.category = Array.isArray(req.body.category)
            ? req.body.category
            : [req.body.category];
    }

    if (req.file) {
        if (bookmark.logo?.publicId) {
            await cloudinary.uploader.destroy(
                bookmark.logo.publicId
            );
        }

        updateData.logo = {
            url: req.file.path,
            publicId: req.file.filename
        };
    }

    const updatedBookmark = await Bookmark.findOneAndUpdate(
        {
            _id: id,
            user: req.currentUser._id
        },
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("user")
        .populate("category");

    res.status(200).json({
        message: "Bookmark updated successfully",
        bookmark: updatedBookmark
    });
};


const getBookmarks = async (req, res) => {
    const {
        id,
        category,
        title,
        rating,
        sort,
        isFavorite,
        page = 1,
        limit = 20
    } = req.query;

    const filter = {
        user: req.currentUser._id
    };

    if (id) {
        filter._id = id;
    }

    if (category) {
        filter.category = category;
    }
    
    if (isFavorite === "true") {
        filter.isFavorite = true;
    }

    if (isFavorite === "false") {
        filter.isFavorite = false;
    }

    if (title) {
        filter.title = {
            $regex: title,
            $options: "i"
        };
    }

    if (rating) {
        filter.rating = Number(rating);
    }

    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * pageLimit;

    let query = Bookmark.find(filter);

    // Sort
    if (sort) {
        query = query.sort(sort);
    } else {
        // default sort: newest first
        query = query.sort("-createdAt");
    }

    // Pagination
    query = query.skip(skip).limit(pageLimit);

    const [bookmarks, total] = await Promise.all([
        query.populate("category"),
        Bookmark.countDocuments(filter)
    ]);

    res.status(200).json({
        bookmarks,
        pagination: {
            page: currentPage,
            limit: pageLimit,
            total,
            totalPages: Math.ceil(total / pageLimit),
            hasNextPage: currentPage < Math.ceil(total / pageLimit),
            hasPrevPage: currentPage > 1
        }
    });
};

const getBookmarkById = async (req, res) => {
    const { id } = req.params;

    const bookmark = await Bookmark.findOneAndUpdate({
        _id: id,
        user: req.currentUser._id
    },
    {
        $inc: { visitCount: 1 }
    },
    {
        new: true
    }
    ).populate("category");;

    if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    res.status(200).json({
        bookmark
    });
};

const getFrequentlyVisitedBookmarks = async (req, res) => {
    const bookmarks = await Bookmark.find({
        user: req.currentUser._id
    }).populate("category")
    .sort({ visitCount: -1 })

    res.status(200).json({
        bookmarks
    });
};

const toggleFavorite = async (req, res) => {
    const { id } = req.params;

    const bookmark = await Bookmark.findOne({
        _id: id,
        user: req.currentUser._id
    });

    if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    bookmark.isFavorite = !bookmark.isFavorite;

    await bookmark.save();

    res.status(200).json({
        message: "Favorite status updated",
        bookmark
    });

};

const deleteBookmark = async (req, res, next) => {
    const { id } = req.params;

    const bookmark = await Bookmark.findOne({
        _id: id,
        user: req.currentUser._id
    });

    if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    if (bookmark.logo?.publicId) {
        await cloudinary.uploader.destroy(
            bookmark.logo.publicId
        );
    }

    await bookmark.deleteOne();

    res.status(200).json({
        message: "Bookmark successfully deleted"
    });
};

// import and export bookmarks

const exportBookmarks = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({
            user: req.currentUser._id
        }).populate("category");

        const data = bookmarks.map((bookmark) => ({
            Title: bookmark.title,
            URL: bookmark.url,
            Description: bookmark.description,
            Rating: bookmark.rating,
            Favorite: bookmark.isFavorite,
            Category: bookmark.category
                .map((c) => c.name)
                .join(", "),
            Visits: bookmark.visitCount,
            CreatedAt: bookmark.createdAt
        }));
        const csv = parser.parse(data);
        res.header("Content-Type", "text/csv");
        res.attachment("bookmarks.csv");
        res.send(csv);
    } catch (error) {
        next(error);
    }

};

const importBookmarks = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError("Please upload a CSV file.");
        }

        const rows = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on("data", (row) => {
                    rows.push(row);
                })
                .on("end", resolve)
                .on("error", reject);
        });

        let imported = 0;
        let duplicates = 0;

        for (const row of rows) {
            // Check duplicate URL
            const exists = await Bookmark.findOne({
                user: req.currentUser._id,
                url: row.URL
            });

            if (exists) {
                duplicates++;
                continue;
            }

            // Convert categories
            const categoryNames = row.Category
                ? row.Category.split(",").map((c) => c.trim())
                : [];

            const categoryIds = [];
            for (const name of categoryNames) {
                let category = await Category.findOne({
                    name,
                    user: req.currentUser._id
                });

                if (!category) {
                    category = await Category.create({
                        name,
                        user: req.currentUser._id
                    });

                }
                categoryIds.push(category._id);
            }

            await Bookmark.create({
                title: row.Title,
                url: row.URL,
                description: row.Description,
                rating: Number(row.Rating),
                isFavorite: row.Favorite === "true",
                category: categoryIds,
                visitCount: Number(row.Visits || 0),
                user: req.currentUser._id
            });
            imported++;
        }

        // Delete uploaded CSV
        fs.unlinkSync(req.file.path);
        res.status(200).json({
            message: "Bookmarks imported successfully.",
            summary: {
                totalRows: rows.length,
                imported,
                duplicates
            }
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

export {
    createBookmark,
    updateBookmark,
    getBookmarks,
    getBookmarkById,
    deleteBookmark,
    getFrequentlyVisitedBookmarks,
    toggleFavorite,
    exportBookmarks,
    importBookmarks
}