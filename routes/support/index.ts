import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { supportSchemaValidations, updateSupportStatusValidations } from "../../middlewares/postMiddleware";
import { createSupportPost, deleteSupportPost, getSingleSupportPost, getSupportAuthor, getSupportPosts, getUserSupportPosts, updateSupportStatus } from "../../controllers/supports";
import upload from "../../utils/fileStorage";

const route = Router()

route.get('/get-support-author', getSupportAuthor)
route.get('/get-supports', getSupportPosts)
route.get('/get-support/:supportId', getSingleSupportPost)
route.get('/user-supports', auth, getUserSupportPosts)
route.patch('/update-support-status', auth, updateSupportStatusValidations, updateSupportStatus)
route.post('/create-support', auth, supportSchemaValidations, upload.array('files'),createSupportPost)
route.delete('/user-support/:supportId', auth, deleteSupportPost)

export default route