import { Settings } from "../models/settings.model.js";
import { NotFoundError } from "../errors/index.js";


const createSettings = async (req, res, next) => {
    const { defaultCategory, defaultRating, darkMode, language } = req.body

    // None is required, so no need for validation

    const settings = await Settings.create({
        defaultCategory,
        defaultRating,
        darkMode,
        language,
        user: req.currentUser._id
    })

    res.status(201).json({
        message: 'Settings created successfully',
        settings
    });
}

const updateSettings = async (req, res, next) => {
    const { defaultCategory, defaultRating, darkMode, language } = req.body;

    const settings = await Settings.findOneAndUpdate(
        {
            user: req.currentUser._id
        },
        {
            $set: {
                defaultCategory,
                defaultRating,
                darkMode,
                language
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!settings) {
        return next(new NotFoundError("Settings not found"));
    }

    res.status(200).json({
        message: "Settings updated successfully",
        settings
    });
};


export {
    createSettings,
    updateSettings
}