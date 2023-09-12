import express from 'express'
import { auth } from '../../middlewares/authMiddleware'
import { addUserDevice, deleteUserDevice, getUserDetails, resetPasssword, updatePassword, updateUserDevice, updateUserLocation, updateUserProfile, uploadUserImage } from '../../controllers/user-profile'
import { locationdValidations, passwordValidations, updateUserPasswordValidations } from '../../middlewares/userMiddleware'
import upload from '../../utils/fileStorage'

const route = express.Router()

route.patch('/reset-password', auth, passwordValidations, resetPasssword)
route.patch('/update-user-location', auth, locationdValidations, updateUserLocation)
route.patch('/update-profile', auth, updateUserProfile)
route.patch('/update-password', auth, updateUserPasswordValidations, updatePassword)
route.patch('/upload-user-picture', auth, upload.single('file'), uploadUserImage)
route.get('/profile', auth, getUserDetails)
route.post('/device', auth, addUserDevice)
route.patch('/device', auth, updateUserDevice)
route.delete('/device/:deviceId', auth, deleteUserDevice)

export default route