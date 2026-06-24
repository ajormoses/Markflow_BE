import { Router } from "express";
import { createBookmark, getBookmarks, updateBookmark, deleteBookmark } from "../controllers/bookmark.controller.js";

const router = Router()


router.post('/create-bookmark', createBookmark)
router.patch('/update-bookmark', updateBookmark)
router.get('/get-bookmark', getBookmarks)
router.delete('/delete-bookmark', deleteBookmark)


export default router