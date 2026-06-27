import { Settings } from "../models/settings.model.js";
import { NotFoundError } from "../errors/index.js";

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
            runValidators: true,
            upsert: true,
            setDefaultsOnInsert: true
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
    updateSettings
}