import { Router } from "express";
import {
    createBookmark,
    getBookmarks,
    getBookmarkById,
    updateBookmark,
    deleteBookmark,
    getFrequentlyVisitedBookmarks, toggleFavorite, exportBookmarks, importBookmarks, deleteAllBookmark, recordBookmarkVisit
} from "../controllers/bookmark.controller.js";
import { validateRequest, requireAuth } from "../middleware/index.js";
import { createBookmarKValidation, updateBookmarkValidation, validateId } from "../constants/validation/bookmark.validate.js";
import { upload } from "../middleware/upload.js";
import { csvUpload } from "../middleware/csvUpload.js";

const router = Router();

router.use(requireAuth);

router.post(
    "/bookmarks",
    upload.single('logo'),
    createBookmarKValidation,
    validateRequest,
    createBookmark
);

router.get("/bookmarks", getBookmarks);

router.get("/bookmarks/frequent", getFrequentlyVisitedBookmarks);

router.get('/bookmarks/export', exportBookmarks);

router.post('/bookmarks/import',
    csvUpload.single("file"),
    importBookmarks
);

router.post(
    "/bookmarks/:id/visit",
    validateId,
    validateRequest,
    recordBookmarkVisit
);

router.get("/bookmarks/:id",
    validateId,
    validateRequest,
    getBookmarkById);

router.patch("/bookmarks/:id", 
    upload.single('logo'),
    updateBookmarkValidation,
    validateRequest,
    updateBookmark
);

router.patch("/bookmarks/:id/favorite", 
    toggleFavorite
);

router.delete("/bookmarks/all",
    deleteAllBookmark);

router.delete("/bookmarks/:id",
    validateId,
    validateRequest,
    deleteBookmark);



export default router;