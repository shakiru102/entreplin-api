import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import { decodePassword, passwordHash } from "../../utils/hashPassword";
import { deleteFile, saveFile } from "../../utils/cloudinary";

export const resetPasssword = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const hashPassword = passwordHash(req.body.password)
    const user = await UserModel.findOneAndUpdate({ 
        _id: userId 
    }, { password: hashPassword })
    if(!user) return res.status(400).send({ error: 'Could not reset password' })
   res.status(200).send({ message: 'Password updated successfully' })
}

export const updateUserLocation = async (req: Request, res: Response) => {

    const userDetaiils = {
        country: req.body.country,
        state: req.body.state,
        phoneNumber: req.body.phoneNumber
    }
    // @ts-ignore
    const user = await UserModel.findOneAndUpdate({ _id: req.userId }, userDetaiils)
    if(!user) return res.status(400).send({ error: 'Could not update user location' })
    res.status(200).send({ message: 'User location updated successfully' })
}

export const getUserDetails = async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await UserModel.findOne({ _id: req.userId })
    if(!user) return res.status(400).send({ error: 'Could not get user details' })
    const {
        fullName,
        email,
        country,
        state,
        phoneNumber,
        picture
    } = user
    res.status(200).send({ fullName, email, country, state, phoneNumber, picture: picture ? picture : '' })
}

export const updateUserProfile = async (req: Request, res: Response) => {
      try {
        // @ts-ignore
      const userId = req.userId
      const userDetaiils = {
        ...(req.body.fullName && { fullName: req.body.fullName }),
        ...(req.body.country && { country: req.body.country }),
        ...(req.body.state && { state: req.body.state }),
        ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
      }
    const user = await UserModel.findOneAndUpdate({ _id: userId }, userDetaiils)
    if(!user) return res.status(400).send({ message: 'Could not update user profile' })
    res.status(200).send({ message: 'User profile updated successfully' })
      } catch (error: any) {
        res.status(500).send({ error: error.message })
      }
}

export const updatePassword = async (req: Request, res: Response) => {
   try {
     // @ts-ignore
     const userId = req.userId
     const user = await UserModel.findById({ _id: userId})
     if(!user) return res.status(400).send({ error: 'Could not update password' })
     const isPassword = await decodePassword(req.body.currentPassword, user.password)
     if(!isPassword) return res.status(400).send({ error: 'Incorrect password' })
     const updateUserPassword = await UserModel.updateOne({ _id: user._id }, { password: passwordHash(req.body.newPassword) })
     if(updateUserPassword.modifiedCount === 0) return res.status(400).send({ error: 'Could not update password' })
     res.status(200).send({ message: 'Password updated successfully' })
   } catch (error: any) {
    res.status(500).send({ error: error.message })
   }
}

export const uploadUserImage = async (req: Request, res: Response) => {
    try {
    // @ts-ignore
    const userId = req.userId
    if(!req.file) throw new Error('Invalid file')
    await deleteFile(userId)
    const { error, savedFile } = await saveFile(req.file.path, 'users', userId)
    if(error) throw new Error(error)
        const isUpdated = await UserModel.findOneAndUpdate({ _id: userId }, { picture: savedFile?.secure_url })
        if(!isUpdated) throw new Error('Could not update user image')
        res.status(200).send({ message: 'User image updated successfully' })
   
    } catch (error: any) {
        res.status(400).send({ error: error.message })
    }
}