import { Request, Response } from "express";
import { deleteFile, saveFile } from "../../utils/cloudinary";
import { TransactionProps } from "../../types";
import TransactionModel from "../../models/TransactionModel";
import paginatedResult from "../../utils/pagination";

export const createBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        let companyLogo: TransactionProps['companyLogo']
        let companyImages: TransactionProps['companyImages'] = []
        const companyProducts = req.body.companyProducts.replace(/[\[\]']+/g, "").split(", ")
        // @ts-ignore
        const userId = req.userId
        // @ts-ignore
        const logo = req.files['logo']
        if(!logo) throw new Error('Please provide a logo image')
        // @ts-ignore
        const images = req.files['images']
        if(!images) throw new Error('Please provide company images')

        if(logo){
            const { path } = logo[0]
            const { error, savedFile } = await saveFile(path, `transactions`)
            if(error) throw new Error(error)
            companyLogo = {
                imageId: savedFile?.public_id,
                url: savedFile?.secure_url
            }
        }

        if(images) {

            for(let image of images) {
                console.log(image);
                
                const { path } = image
                const { error, savedFile } = await saveFile(path, `transactions`)
                if(error) throw new Error(error)
                companyImages.push({
                    imageId: savedFile?.public_id,
                    url: savedFile?.secure_url
                })
            }

        }

        const transaction = await TransactionModel.create({...req.body, companyProducts, companyImages, companyLogo, authorId: userId })
        if(!transaction) throw new Error(`Error creating transaction`)
        res.status(200).send({ message: 'Buisness transaction is created sucessfully.' })
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
}

export const getBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const country = req.query.country || ''
        const transactionType = req.query.transactionType || 'All'
        const transactions = await TransactionModel.find({
                    country: { $regex: country, $options: 'i' },
                    ...(transactionType !== 'All' && { transactionType })
                }).populate("authorId", '-__v -password -verificationCode')
        if(!transactions) throw new Error(`No transactions found`)
        res.status(200).json(paginatedResult(transactions, page, limit))
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
    
}

export const getUserBusinessTransactiontPosts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const page = parseInt(req.query.page as any) || 1 
        const limit = parseInt(req.query.limit as any) || 10 
        const supports = await TransactionModel.find({ authorId: userId }).populate("authorId", '-__v -password -verificationCode')
        res.status(200).json(paginatedResult(supports, page, limit))
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const singleBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = await TransactionModel.findById({ _id: req.params.transactionId }).populate("authorId", '-__v -password -verificationCode')
        if(!transaction) throw new Error(`No transaction found`)
        res.status(200).json(transaction)
        
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}

export const deleteBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const isDeleted = await TransactionModel.findOneAndDelete({
            _id: req.params.transactionId
        }, { authorId: userId })
        if(!isDeleted) throw new Error(`No transaction found`)
        const { error } = await deleteFile(isDeleted.companyLogo?.imageId)
        if(error) throw new Error(error)
        // @ts-ignore
        for (let image of isDeleted.companyImages) {
            const { imageId } = image
            const { error } = await deleteFile(imageId)
            if(error) throw new Error(error)
        }
        res.status(200).send({ message: 'Buisness transaction is deleted sucessfully.' })
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}

export const buinessTransactionAction = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.transactionId
        // @ts-ignore
        const userId = req.userId
        const transaction = await TransactionModel.findById(transactionId)
         if(!transaction) return res.status(400).send({ error: 'Could not get transaction post' })
         const saveTransaction = await TransactionModel.findOne({ _id: transactionId, savedUsers: userId })
         
         if(saveTransaction) {
            const isUnSaved = await TransactionModel.updateOne({
                _id: transactionId
            }, { 
                $pull: {
                    savedUsers: userId
                }
             })
            if(!isUnSaved) return res.status(400).send({ error: 'Can not unsave post' })
            return res.status(200).send({ message: 'Buisness transaction is unsaved' })
         }
        const isSaved = await TransactionModel.updateOne({ _id: transactionId }, {
            $push: {
                savedUsers: userId
            }
        })
        if(!isSaved) return res.status(400).send({ error: 'Can not save transaction post' })
        res.status(200).send({ message: 'Buisness transaction is saved sucessfully.' })
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const userSavedBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const transactions = await TransactionModel.find({
            savedUsers: {
                $in: userId
            }
        }, { savedUsers: 0 }).populate("authorId", '-__v -password -verificationCode')
        if(!transactions) return res.status(400).send({ error: 'No saved post found' })
        res.status(200).json(transactions)
    } catch (error: any) {
     res.status(500).send({ error: error.message })   
    }
}
