import { Request, Response } from "express";
import { deleteFile, saveFile } from "../../utils/cloudinary";
import { TransactionProps } from "../../types";
import TransactionModel from "../../models/TransactionModel";
import paginatedResult from "../../utils/pagination";

export const createBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        let companyLogo: TransactionProps['companyLogo']
        let companyImages: TransactionProps['companyImages'] = []
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

        const transaction = await TransactionModel.create({...req.body, companyImages, companyLogo, authorId: userId })
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
        const transactionType = req.query.transactionType

        const transactions = await TransactionModel.find({
                    country: { $regex: country, $options: 'i' },
                    ...(transactionType && { transactionType })
                }, { savedUsers: 0 })
        if(!transactions) throw new Error(`No transactions found`)
        res.status(200).json(paginatedResult(transactions, page, limit))
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
    
}

export const singleBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = await TransactionModel.findById({ _id: req.params.transactionId }, {savedUsers: 0})
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

export const saveBuinessTransaction = async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.transactionId
        // @ts-ignore
        const userId = req.userId
        const savedTransaction = await TransactionModel.findOne({ 
            savedUsers: {
                $in: userId
            }
         })
         if(savedTransaction) return res.status(200).send({ message: 'Transaction already saved' })
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
        }, { savedUsers: 0 })
        if(!transactions) return res.status(400).send({ error: 'No saved post found' })
        res.status(200).json(transactions)
    } catch (error: any) {
     res.status(500).send(error)   
    }
}

export const unsaveBuisnessTransaction = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const transactionId = req.params.transactionId
        const isUpdated = await TransactionModel.updateOne({
            _id: transactionId
        }, { 
            $pull: {
                savedUsers: userId
            }
         })
        if(!isUpdated) return res.status(400).send({ error: 'Cannot unsave post' })
        res.status(200).send({ message: 'Post as been unsaved' })
    } catch (error: any) {
     res.status(500).send(error)   
    }
}