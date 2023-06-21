import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { commentActions, commentReply, creatComment, forumActivityeNotifications, forumPost, getForumActivityeNotifications, getForumPosts, getForums, getSingleForumPost, joinForum, postLike, replyAction, updateForumActivityNotification } from "../../controllers/forum";
import { commentPostValidations, discussionPostValidations, forumActivityNotificationValidations } from "../../middlewares/postMiddleware";

const route = Router();

route.get('/join-forum', auth, joinForum)
route.get('/forums', auth, getForums)
route.get('/forums/:forumId', auth, getForumPosts)
route.get('/forum-post/:postId', auth, getSingleForumPost)
route.get('/forum-activity-notifications/:forumId', auth, getForumActivityeNotifications)
route.post('/forum-post', auth, discussionPostValidations, forumPost)
route.post('/forum-activity-notification', auth, forumActivityNotificationValidations, forumActivityeNotifications)
route.patch('/forum-post-action', auth, postLike)
route.patch('/forum-post-comment', auth, commentPostValidations, creatComment)
route.patch('/forum-post-comment-action', auth, commentActions)
route.patch('/forum-post-comment-reply', auth, commentReply)
route.patch('/forum-post-comment-reply-action', auth, replyAction)
route.patch('/forum-activity-notification-seen/:notificationId', auth, updateForumActivityNotification)



export default route