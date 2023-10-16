import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import { decodePassword, passwordHash } from "../../utils/hashPassword";
import { deleteFile, saveFile } from "../../utils/cloudinary";
import { addDeviceSchemaValidate, updateDeviceSchemaValidate } from "../../utils/joi";
import UserDevice from "../../models/OneSignalDevice";
import { UserDeviceProps } from "../../types";

export const resetPasssword = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
    const userId = req.userId
    const hashPassword = passwordHash(req.body.password)
    const user = await UserModel.updateOne({ 
        _id: userId 
    }, { password: hashPassword })
    if(!user) return res.status(400).send({ error: 'Could not reset password' })
   res.status(200).send({ message: 'Password updated successfully' })
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
}

export const updateUserLocation = async (req: Request, res: Response) => {

    try {
      const userDetaiils = {
        country: req.body.country,
        state: req.body.state,
        phoneNumber: req.body.phoneNumber
    }
    // @ts-ignore
    const userId = req.userId
    const user = await UserModel.updateOne({ _id: userId }, userDetaiils)
    if(user.modifiedCount === 0) return res.status(400).send({ error: 'Could not update user location' })
    res.status(200).send({ message: 'User location updated successfully' })
    } catch (error: any) {
      res.status(500).send({ error: error.message })
    }
}

export const getUserDetails = async (req: Request, res: Response) => {
   try {
     // @ts-ignore
     const user = await UserModel.findById(req.userId, { password: 0, verificationCode: 0 }).populate("devices")
     if(!user) return res.status(400).send({ error: 'Could not get user details' })
     res.status(200).json(user)
   } catch (error: any) {
    res.status(500).send({ error: error.message })
   }
}

export const updateUserProfile = async (req: Request, res: Response) => {
      try {
        // @ts-ignore
      const userId = req.userId
      console.log(userId);
      
      const userDetaiils = {
        ...(req.body.fullName && { fullName: req.body.fullName }),
        ...(req.body.country && { country: req.body.country }),
        ...(req.body.state && { state: req.body.state }),
        ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
      }
    const user = await UserModel.updateOne({ _id: userId }, userDetaiils)
    if(user.modifiedCount === 0) return res.status(400).send({ message: 'Could not update user profile' })
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

export const addUserDevice = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const { error } = addDeviceSchemaValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })

    const user = await UserModel.findById(userId)
    if(user?.devices?.length === 3) return res.status(400).send({ error: "User can only register 3 devices" })
    
    const device = await UserDevice.create({
      ...req.body,
      lastSeen: req.body.lastSeen ? req.body.lastSeen : Date.now(),
      userId
    })
    
    if(!device) return res.status(400).send({ error: "Device not created" })
    await UserModel.updateOne({ _id: userId }, { 
       $push: {
        devices: device._id
       }
    })
     res.status(200).send({ message: "Device successfully created" })
  } catch (error: any) {
     res.status(500).send({ error: error.message })
  }
}

export const updateUserDevice = async (req: Request, res: Response) => {
    try {
      const { error } = updateDeviceSchemaValidate(req.body)
      const { _id, lastSeen }:UserDeviceProps = req.body
      if(error) return res.status(400).send({ error: error.details[0].message })
      const isUpdated = await UserDevice.updateOne({ _id }, {
       $set: {
        lastSeen
       }
      })
      if(isUpdated.modifiedCount === 0) return res.status(400).send({ error: "Could not update device" })
      res.status(200).send({ message: "Device successfully updated" })
    } catch (error: any) {
      res.status(500).send({ error: error.message })
    }
}

export const deleteUserDevice =  async (req: Request, res: Response) => {
  try {
     // @ts-ignore
     const userId = req.userId
      const isDeleted = await UserDevice.deleteOne({ _id: req.params.deviceId })
      if(isDeleted.deletedCount === 0) return res.status(400).send({ error: 'Device not deleted' })
      await UserModel.updateOne({ _id: userId }, {
       $pull: {
         devices: req.params.deviceId
       }
      })
      res.status(200).send({ message: 'Device deleted successfully' })
  } catch (error: any) {
    res.status(500).send({ error: error.message })
  }
}

export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId
    await UserModel.deleteOne({ _id: userId })
    await UserDevice.deleteMany({ userId })
    res.status(200).send({ message: 'User deleted successfully'})
  } catch (error: any) {
    res.status(500).send({ error: error.message })
  }
}