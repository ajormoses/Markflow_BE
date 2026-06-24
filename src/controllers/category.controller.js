import { Category } from "../models/category.model.js";
import { NotFoundError, BadRequestError} from "../errors/index.js"

const createCategory = async (req, res, next) => {
    const {name, icon, color} = req.body

    //validate
    if(!name) {
        throw new BadRequestError('Name is required')
    }

    // create category
    const category = await Category.create({
        name,
        icon,
        color,
        user: req.currentUser._id
    })

    res.status(201).json({
        message: "Category successfully created", category
    })
}

const updateCategory = async (req, res, next) => {
    const {name, icon, color} = req.body
    const { id } = req.params

    // check if id exist
    const findCategoryId = await Category.findById({
        _id: id,
        user: req.currentUser._id
    })

    if(!findCategoryId) {
        throw new BadRequestError('Id is required')
    }

    const category = await Category.findByIdAndUpdate({
        _id: id,
        user: req.currentUser._id
    }, 
    {
        $set: {name, icon, color}
    },
    {
        new: true,
        runValidators: true
    })

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    res.status(200).json({
        message: 'Category successfully updated', category
    })
}

const getCategory = async (req, res, next) => {
    const categories = await Category.find({
        user: req.currentUser._id
    });

    res.status(200).json(categories)
}

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findOneAndUpdate({
        _id: id,
        user: req.currentUser._id
    },
    );

    if (!category) {
        throw new NotFoundError("category not found");
    }

    res.status(200).json({
        category
    });
};



const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
        _id: id,
        user: req.currentUser._id
    });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    res.status(200).json({
        message: "Category successfully deleted"
    });
};



export {
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory,
    getCategoryById
}