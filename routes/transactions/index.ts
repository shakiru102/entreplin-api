import { Router } from "express";
import upload from "../../utils/fileStorage";
import { createBuisnessTransaction, deleteBuisnessTransaction, getBuisnessTransaction, saveBuinessTransaction, singleBuisnessTransaction, unsaveBuisnessTransaction, userSavedBuisnessTransaction } from "../../controllers/transactions";
import { auth } from "../../middlewares/authMiddleware";
import { transactionSchemaValidation } from "../../middlewares/postMiddleware";

const route = Router()

route.post('/create-transaction', auth, upload.fields([
    { name: 'logo'}, 
    { name: 'images'}
]), transactionSchemaValidation, createBuisnessTransaction)

route.get('/transactions', getBuisnessTransaction)
route.get('/single-transaction/:transactionId', singleBuisnessTransaction)
route.get('/user-saved-transaction', auth, userSavedBuisnessTransaction)
route.patch('/save-buisness-transaction/:transactionId', auth, saveBuinessTransaction)
route.patch('/unsave-buisness-transaction/:transactionId', auth, unsaveBuisnessTransaction)
route.delete('/buisness-transaction/:transactionId', auth, deleteBuisnessTransaction)




export default route