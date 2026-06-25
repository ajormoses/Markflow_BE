import { Bookmark } from "../models/bookmarks.model.js";
import { BadRequestError } from "../errors/index.js"
import { Settings } from "../models/settings.model.js";



const createBookmark = async (req, res, next) => {
    const { title, description, rating, url, category } = req.body

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


const updateBookmark = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new BadRequestError("Bookmark id is required");
    }

    if (!updatedBookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    const updateData = {
        ...req.body
    };

    if (req.file) {
        // Delete old file
        if (Bookmark.logo?.publicId) {
            await cloudinary.uploader.destroy(
                Bookmark.logo.publicId
            );
        }

        // Replace with new one
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
            new: true,  // returns new document, very important! gives recent update
            runValidators: true
        }
    ).populate("user");

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


const deleteBookmark = async (req, res, next) => {
    const {id} = req.params

    if (!id) {
        throw new BadRequestError("Bookmark id is required");
    }

    const bookmark = await Bookmark.findOne({
        _id: id,
        user: req.currentUser._id

    });

    if (!bookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    // Delete logo from Cloudinary
    if (bookmark.logo?.publicId) {
        await cloudinary.uploader.destroy(
            bookmark.logo.publicId
        );
    }

    await bookmark.deleteOne();

    res.status(200).json({
        message: 'Bookmark successfully deleted'
    })
}


export {
    createBookmark,
    updateBookmark,
    getBookmarks,
    getBookmarkById,
    deleteBookmark,
    getFrequentlyVisitedBookmarks
}