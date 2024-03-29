import { Router } from "express";
import upload from "../../utils/fileStorage";
import { buinessTransactionAction, createBuisnessTransaction, deleteBuisnessTransaction, getBuisnessTransaction, getUserBusinessTransactiontPosts, singleBuisnessTransaction, userSavedBuisnessTransaction } from "../../controllers/transactions";
import { auth } from "../../middlewares/authMiddleware";
import { transactionSchemaValidation } from "../../middlewares/postMiddleware";

const route = Router()

route.post('/create-transaction', auth, upload.fields([
    { name: 'logo'}, 
    { name: 'images'}
]), transactionSchemaValidation, createBuisnessTransaction)

route.get('/transactions', getBuisnessTransaction)
route.get('/user-transactions', auth, getUserBusinessTransactiontPosts)
route.get('/single-transaction/:transactionId', singleBuisnessTransaction)
route.get('/user-saved-transaction', auth, userSavedBuisnessTransaction)
route.patch('/buisness-transaction-action/:transactionId', auth, buinessTransactionAction)
route.delete('/buisness-transaction/:transactionId', auth, deleteBuisnessTransaction)




export default route