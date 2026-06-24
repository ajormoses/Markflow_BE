import { Bookmark } from "../models/bookmarks.model.js";
import { BadRequestError } from "../errors/index.js"



const createBookmark = async (req, res, next) => {
    const { title, description, rating, url, imageIcon, category } = req.body

    // Validate
    if (!title || !url) {
        throw new BadRequestError('Title or Url is required')
    }

    const bookmark = await Bookmark.create({
        title,
        description,
        url,
        category,
        rating,
        imageIcon,
        user: req.currentUser._id

    });

    res.status(201).json({message: "Bookmark created successfully", bookmark});
}


const updateBookmark = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new BadRequestError("Bookmark id is required");
    }

    const updatedBookmark = await Bookmark.findOneAndUpdate(
        {
            _id: id,
            user: req.currentUser._id
        },
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate("user");

    if (!updatedBookmark) {
        throw new NotFoundError("Bookmark not found");
    }

    res.status(200).json({
        message: "Bookmark updated successfully", 
        bookmark: updatedBookmark
    });
};


const getBookmarks = async (req, res) => {
    const { id, category, title, rating } = req.query;

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
            $options: "i"  // means case insensitive
        };
    }

    if (rating) {
        filter.rating = Number(rating);
    }

    const bookmarks = await Bookmark.find(filter);

    res.status(200).json({
        bookmarks
    });
};


const deleteBookmark = async (req, res, next) => {
    const {id} = req.params

    if (!id) {
        throw new BadRequestError("Bookmark id is required");
    }

    const bookmark = await Bookmark.findOneAndDelete({
        _id: id,
        user: req.currentUser._id
    
    })

    if(!bookmark) {
        throw new BadRequestError('Bookmark not found')
    }

    res.status(200).json({
        message: 'Bookmark successfully deleted'
    })
}


export {
    createBookmark,
    updateBookmark,
    getBookmarks,
    deleteBookmark
}