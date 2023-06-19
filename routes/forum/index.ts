import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { commentActions, commentReply, creatComment, forumPost, forumPostNotifications, getForumPosts, getForums, joinForum, postLike, readForumPostNotifications, replyAction } from "../../controllers/forum";
import { commentPostValidations, discussionPostValidations } from "../../middlewares/postMiddleware";

const route = Router();

route.get('/join-forum', auth, joinForum)
route.get('/forums', auth, getForums)
route.get('/forums/:forumId', auth, getForumPosts)
route.get('/forum-post-notifications/:forumId', auth, forumPostNotifications)
route.post('/forum-post', auth, discussionPostValidations, forumPost)
route.patch('/forum-post-action', auth, postLike)
route.patch('/forum-post-comment', auth, commentPostValidations, creatComment)
route.patch('/forum-post-comment-action', auth, commentActions)
route.patch('/forum-post-comment-reply', auth, commentReply)
route.patch('/forum-post-comment-reply-action', auth, replyAction)
route.patch('/forum-seen-post/:forumId', auth, readForumPostNotifications)



export default route