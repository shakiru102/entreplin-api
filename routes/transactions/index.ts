import { Router } from "express";
import upload from "../../utils/fileStorage";
import { createBuisnessTransaction, deleteBuisnessTransaction, getBuisnessTransaction, singleBuisnessTransaction } from "../../controllers/transactions";
import { auth } from "../../middlewares/authMiddleware";
import { transactionSchemaValidation } from "../../middlewares/postMiddleware";

const route = Router()

route.post('/create-transaction', auth, upload.fields([
    { name: 'logo'}, 
    { name: 'images'}
]), transactionSchemaValidation, createBuisnessTransaction)

route.get('/transactions', getBuisnessTransaction)
route.get('/single-transaction/:transactionId', singleBuisnessTransaction)
route.delete('/buisness-transaction/:transactionId', auth, deleteBuisnessTransaction)




export default route