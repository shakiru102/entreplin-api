import { Request, Response } from "express";
import SupportModel from "../../models/SupportModel";
import { SupportProps } from "../../types";
import { saveFile } from "../../utils/cloudinary";
import UserModel from "../../models/UserModel";
import paginatedResult from "../../utils/pagination";

export const createSupportPost = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const files = req.files
        const post: SupportProps = req.body
        if (files){
        const supportImages: SupportProps['images'] = [] 
        // @ts-ignore
           for (let file of files) {
            const { path } = file
            const { savedFile } = await saveFile(path, userId)
            if(savedFile) {
            supportImages
                        .push({
                            imageId: savedFile.public_id,
                            url: savedFile.secure_url,
                        })
              }
           }
           const isPost = await SupportModel.create({ ...post, authorId: userId, images: supportImages })
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
        const page = parseInt(req.query.page as any) || 1 
        const limit = parseInt(req.query.limit as any) || 10 
        const supports = await SupportModel.find({})
        if(!supports) throw new Error(`Could not find any support posts`)
        res.status(200).json(paginatedResult(supports, page, limit))
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}

export const getSingleSupportPost = async (req: Request, res: Response) => {
    try {
        const supportId = req.params.supportId
        const support = await SupportModel.findOne({ _id: supportId})
        if(!support) throw new Error(`Support not found`)
        res.status(200).json(support)
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}

export const updateSupportStatus = async (req: Request, res: Response) => {
    try {
        const { _id, supportType  }: SupportProps = req.body
        const isUpdated = await SupportModel.findOneAndUpdate({_id }, { supportType })
        if(!isUpdated) throw new Error(`Could not update support status`)
        res.status(200).send({ message: `Support status updated successfully`})
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}

export const getUserSupportPosts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const page = parseInt(req.query.page as any) || 1 
        const limit = parseInt(req.query.limit as any) || 10 
        const supports = await SupportModel.find({ authorId: userId })
        if(!supports) throw new Error(`Could not find any support posts`)
        res.status(200).json(paginatedResult(supports, page, limit))
    } catch (error: any) {
        
    }
}

export const deleteSupportPost = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const supportId = req.params.supportId
        const isDeleted = await SupportModel.deleteOne({ _id: supportId, authorId: userId })
        if(isDeleted.deletedCount === 0) throw new Error(`Invalid support id`)
        res.status(200).send({ message: `Support post deleted successfully`})
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}
