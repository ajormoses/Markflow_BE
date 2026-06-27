import multer from "multer";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const csvUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "text/csv" ||
            file.originalname.endsWith(".csv")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"));
        }
    }
});