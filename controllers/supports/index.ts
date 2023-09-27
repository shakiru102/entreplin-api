import { Request, Response } from "express";
import SupportModel from "../../models/SupportModel";
import { SupportProps } from "../../types";
import { deleteFile, saveFile } from "../../utils/cloudinary";
import UserModel from "../../models/UserModel";
import paginatedResult from "../../utils/pagination";

export const createSupportPost = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const files = req.files
        console.log(req.body);
        
        const post: SupportProps = req.body
        const conditions = req.body.conditions.replace(/[\[\]']+/g, "").split(", ")
        if (files){
        const supportImages: SupportProps['images'] = [] 
        // @ts-ignore
           for (let file of files) {
            const { path } = file
            const { savedFile } = await saveFile(path, `supports`)
            if(savedFile) {
            supportImages
                        .push({
                            imageId: savedFile.public_id,
                            url: savedFile.secure_url,
                        })
              }
           }
           const isPost = await SupportModel.create({ ...post, conditions, authorId: userId, images: supportImages })
            if(!isPost) throw new Error(`Could not create ${ post.supportType } post`)
            return  res.status(200).send({ message: `${ post.supportType} post created successfully`})
        }
        const isPost = await SupportModel.create({ ...post, authorId: userId })
        if(!isPost) throw new Error(`Could not create ${ post.supportType } post`)
        res
            .status(200)
            .send({ 
                message: `${ post.supportType} post created successfully`,
                warning: `${ post.supportType} post images were not created`
             })
        
    } catch (error: any) {
        res.status(400).send({ error:  error.message })
    }
}

export const getSupportAuthor = async (req: Request, res: Response) => {
    try {
        const authorId = req.query.author
        if(!authorId) throw new Error(`author is ${authorId}`)
        const user = await UserModel.findOne({ _id: authorId })
        if(!user) throw new Error(`Author not found`)
        const { picture, country, state, fullName } = user
        res.status(200).send({ picture, country, state, fullName })
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}

export const getSupportPosts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1 
        const limit = parseInt(req.query.limit as string) || 10 
        const country = req.query.country || ''
        const supportType: any = req.query.supportType
        
        const supports = await SupportModel.find({ 
            ...(country && {country: { 
                                $regex: country,
                                $options: 'i'
                            }}),
             ...(supportType && { supportType })
         }).populate("authorId", '-__v -password -verificationCode')
         
        if(!supports) return res.status(400).send({ error: `Could not find any support posts` })
        res.status(200).json(paginatedResult(supports, page, limit))
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const extendSupportDate = async (req: Request, res: Response) => {
    const supportId =  req.params.supportId
    const isSupport = await SupportModel.findById(supportId)
    if(!isSupport) return res.status(400).send({ error: `Could not find support post with id: ${supportId}` })
    const currentDate = new Date();
    // Add 7 days to the current date
    const sevenDaysLater = new Date(currentDate);
    sevenDaysLater.setDate(currentDate.getDate() + 7);
    
    const isDateUpdated = await SupportModel.updateOne({_id: supportId}, {
        $set: {
            endDate: sevenDaysLater.toDateString()
        }
    })

    if(isDateUpdated.modifiedCount === 0) res.status(400).send({ error: 'Could not update support date' })
    res.status(200).send({ message: 'Support date extended successfully' })
}

export const getSingleSupportPost = async (req: Request, res: Response) => {
    try {
        const supportId = req.params.supportId
        const support = await SupportModel.findOne({ _id: supportId}).populate("authorId", '-__v -password -verificationCode')
        if(!support) return res.status(400).send({ error: `Support not found` })
        res.status(200).json(support)
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const updateSupportStatus = async (req: Request, res: Response) => {
    try {
        const { _id, supportType  }: SupportProps = req.body
        const isUpdated = await SupportModel.findOneAndUpdate({_id }, { supportType })
        if(!isUpdated) return res.status(400).send({ error: `Could not update support status` })
        res.status(200).send({ message: `Support status updated successfully`})
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const getUserSupportPosts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const page = parseInt(req.query.page as any) || 1 
        const limit = parseInt(req.query.limit as any) || 10 
        const supports = await SupportModel.find({ authorId: userId }).populate("authorId", '-__v -password -verificationCode')
        res.status(200).json(paginatedResult(supports, page, limit))
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const deleteSupportPost = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const supportId = req.params.supportId
        const isDeleted = await SupportModel.findOneAndDelete({ _id: supportId }, { authorId: userId })
        if(!isDeleted) return res.status(400).send({ error: `Entry does not exist` })
        if(isDeleted.images) {
        for (let image of isDeleted?.images){
            const { imageId } = image
           const { error } =  await deleteFile(imageId)
           if(error) throw new Error(error)
        }

        }
        res.status(200).send({ message: `Support post deleted successfully`})
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}