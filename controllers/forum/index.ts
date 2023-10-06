import { Request, Response } from "express";
import Forum from "../../models/Forum";
import { DiscussionsProps, ForumComment, ForumNotificationsProps, ReplyProps, SignUpProps } from "../../types";
import ForumPost from "../../models/ForumPost";
import ForumNotification from "../../models/ForumNotification";
import UserModel from "../../models/UserModel";
import { sendNotification } from "../../utils/oneSignal";

export const joinForum = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    try {
        const forum = await Forum.find({})
        if(forum.length === 0) {
            const createForum = await Forum.create({ members: [ userId ] })
            if(!createForum) return res.status(400).send({ error: "Could not create forum" })
            return res.status(200).json(createForum)
        }
        const { _id } = forum[0]
        const isMember = await Forum.findOne({
            members: {
                $in: [ userId ]
            }
        })
        if(isMember) return res.status(200).send({ 
            message: 'User alreay a member',
           forum: isMember
        })
        const joinForum = await Forum.updateOne({ _id }, {
            $push: {
                members: userId
            }
        })

    // @ts-ignore
        await UserModel.updateOne({ _id: req.userId }, {
            $set: {
                joinedForum: true
            }
        })
        if(joinForum.modifiedCount === 0) res.status(400).send({ error: "Could not join"})
        res.status(200).send(forum[0])
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const getForums = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const forums = await Forum.find({
            members: {
                $in: [userId]
            }
        })
        if(forums.length === 0) res.status(400).send({ error: "Could not find forums" })
        res.status(200).json(forums)
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const forumPost = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const {
        forumId,
        forumPost
    }: DiscussionsProps = req.body
    try {

        const user = await UserModel.findOne({ _id: userId, joinedForum: true })
        if(!user) return res.status(400).send({ error: "Please join the forum to send forum post" })

        const forumMessage = await ForumPost.create({
            forumId,
            authorId: userId,
            forumPost,
            meta_data: userId
        })

        const forumUsers =  await UserModel.find({ joinedForum: true }).populate('devices')
        let deviceIds: string[] = []
        // @ts-ignore
         forumUsers.forEach((user) => user.id !== userId && user.devices?.forEach(device =>  deviceIds.push(device.oneSignalId)))
         
         const contents = {
            en: forumPost 
        }
        const headings = {
            en: 'Entreplin'
        }

        if(!forumMessage) res.status(400).send({ error: "Could not send forum message" })
        await sendNotification(deviceIds, {
            contents,
            headings
           })
        res.status(200).json(forumMessage)
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const postLike = async  (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const postId = req.query.postId
    if(!postId) return res.status(400).send({ error: 'Invalid postId query' })
    try {
        const forumPost = await ForumPost.findById(postId)
        if(!forumPost) return res.status(400).send({ error: 'Could not find forum post" id: ' + postId })
        
        const likedPost = forumPost.likes?.find(item => item === userId)
        if(likedPost) {
            const unlikepost = await ForumPost.updateOne({ _id: postId }, {
                $pull: {
                    likes: userId
                }
            }) 
            if(unlikepost.modifiedCount === 0) return res.status(400).send({ error: 'Could not unlike post" id: ' + postId })
            return res.status(200).send({ message: 'Post is unliked.' })
        }
       
        const likePost = await ForumPost.updateOne({ _id: postId }, {
            $push: {
                likes: userId
            }
        })

        if(likePost.modifiedCount === 0) return res.status(400).send({ error: "Could not like post" })
        res.status(200).send({ message: 'Post is liked' })

    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const creatComment = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const { text, postId } = req.body
    try {
        const comment: ForumComment = {
            authorId: userId,
            text,
            meta_data: userId
        }
        const forumPost = await ForumPost.updateOne({ _id: postId}, {
            $push: {
                comments: comment
            }
        })
        if(!forumPost) return res.status(400).send({ error: " Could not create comment" })
        res.status(200).send({ message: "Comment created" })
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const getForumPosts = async (req: Request, res: Response) => {
    try {
        const forumId = req.params.forumId
        const page = parseInt(req.query.page as string) || 0 
        const limit = parseInt(req.query.limit as string) || 20 
        const posts = await ForumPost.find({ forumId })
        .populate("meta_data", '-__v -password -verificationCode')
        .populate({
            path: 'comments',
            populate: {
                path:'meta_data',
                select: '-__v -password -verificationCode'
            }
        })
        .populate({
            path: 'comments.reply',
            populate: {
                path:'meta_data',
                select: '-__v -password -verificationCode'
            }
        })
        .sort({
            createdAt: -1
        })
         .limit(limit)
         .skip(limit * page)
        res.status(200).json(posts)
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const commentActions = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const postId = req.query.postId
    const commentId = req.query.commentId

    if(!postId || !commentId ) return res.status(400).send({ error: "post id or comment id is not valid" })

    try {
        const comments = await ForumPost.findById(postId)
        const isCommentSaved = comments?.comments?.find(comment => comment._id == commentId)
        const liked = isCommentSaved?.likes?.find(item => item === userId)
        
        if (liked) {
            const unlike = await ForumPost.updateOne({ _id: postId, "comments._id": commentId }, {
                $pull: {
                    "comments.$.likes": userId
                }
            })
            if(unlike.modifiedCount === 0) return res.status(400).send({ error: "Can not unlike comment" })
            return res.status(200).send({ message: "Comment unliked" })
        }
        const like = await ForumPost.updateOne({ _id: postId, "comments._id": commentId }, {
            $push: {
                "comments.$.likes": userId
            }
        })
        if(like.modifiedCount === 0) return res.status(400).send({ error: "Can not like comment" })
            return res.status(200).send({ message: "Comment liked" })
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const commentReply = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const commentId = req.query.commentId
    const postId = req.query.postId
    if(!postId || !commentId ) return res.status(400).send({ error: "post id or comment id is not valid" })

    try {
        const { text }: ReplyProps = req.body 
        if(!text) return res.status(400).send({ error: "text is required" })
        const reply: ReplyProps = {
            authorId: userId,
            text,
            meta_data: userId
        }
        const post = await ForumPost.findById(postId)
        if(!post) return res.status(400).send({ error: "Post not found" })

        const replied = await ForumPost.updateOne({ _id: postId, "comments._id": commentId }, {
            $push: {
                "comments.$.reply": reply
            }
        })
        if(replied.modifiedCount === 0) return res.status(400).send({ error: "Could not reply comment" })
        res.status(200).send({ message: "comment replied" })
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const replyAction = async (req: Request, res: Response) => {
    try {
         // @ts-ignore
        const userId = req.userId
        const postId = req.query.postId
        const commentId = req.query.commentId
        const replyId = req.query.replyId
        const post = await ForumPost.findById(postId)
        if(!post) return res.status(400).send({ error: "Could not find post with id:" + postId})
        const comment = post.comments?.find(commentsId => commentsId._id == commentId)
        const reply = comment?.reply?.find(repliesId => repliesId._id == replyId)
        const liked = reply?.likes?.find(item => item === userId)
        
        if(liked) {
            const unlike = await ForumPost.updateOne({
                _id: postId,
                "comments._id": commentId,
                "comments.reply._id": replyId
            },{
                $pull: {
                    "comments.$[i].reply.$[j].likes": userId
                }
            }, {
                arrayFilters: [
                    { "i._id": commentId },
                    { "j._id": replyId }
                ]
            })

            if(unlike.modifiedCount === 0) return res.status(400).send({ error: "Could not update reply" })
            return res.status(200).send({ message: "reply unliked" })
        }
        const unlike = await ForumPost.updateOne({
            _id: postId,
            "comments._id": commentId,
            "comments.reply._id": replyId
        },{
            $push: {
                "comments.$[i].reply.$[j].likes": userId
            }
        }, {
            arrayFilters: [
                { "i._id": commentId },
                { "j._id": replyId }
            ]
        })

        if(unlike.modifiedCount === 0) return res.status(400).send({ error: "Could not update reply" })
        return res.status(200).send({ message: "reply liked" })
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}

export const updateForumActivityNotification = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const notificationId = req.params.notificationId
        const isRead = await ForumNotification.updateOne({ _id: notificationId, "receiverId.userId": userId }, {
            $set: {
                "receiverId.$.isSeen": true
            }
        })
        res.status(200).json(isRead)
    } catch (error: any) {
        res.status(500).send({error: error.message})
    }
}

export const deleteForumNotification = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const notificationId = req.params.notificationId
        const isDeleted = await ForumNotification.deleteOne({ _id: notificationId })
        if(isDeleted.deletedCount == 0) return res.status(400).send({ error: "Could not delete notification" }) 
        res.status(200).send({ message: "Notification is deleted" })
    } catch (error: any) {
        res.status(500).send({error: error.message})
    }
}

export const forumActivityeNotifications = async (req:Request, res: Response) => {
    try {
    const postLikeNotification = await ForumNotification.create(req.body)
    if(!postLikeNotification) return res.status(400).send({ error: "Could not create notification" })
    res.status(200).json(postLikeNotification)
    } catch (error: any) {
       res.status(500).send(error.message)  
    }
}

export const getForumActivityeNotifications = async (req:Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const forumId = req.params.forumId
    try {
        const notifications = await ForumNotification.find({
            forumId,
            "receiverId.userId": userId
        })
        res.status(200).json(notifications)
    } catch (error: any) {
       res.status(500).send(error.message) 
    }
}

export const getSingleForumPost = async (req:Request, res: Response) => {
    try {
        const post = await ForumPost.findById(req.params.postId)
        .populate("meta_data", '-__v -password -verificationCode')
        .populate({
            path: 'comments',
            populate: {
                path:'meta_data',
                select: '-__v -password -verificationCode'
            }
        })
        .populate({
            path: 'comments.reply',
            populate: {
                path:'meta_data',
                select: '-__v -password -verificationCode'
            }
        })
        if(!post) return res.status(400).send({ error: "No post found" })
        res.status(200).json(post)
    } catch (error: any) {
        res.status(500).send(error.message)
    }
}
