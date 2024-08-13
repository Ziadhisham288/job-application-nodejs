import express from "express"
import { deleteAccount, forgotPassword, getAllAccountsForRecoveryAccount, getAnotherAccountInfo, getUserInfo, resetPassword, signIn, signUp, updateInfo, updatePassword } from "./User.controller.js";
import { hashPassword } from "../../middleware/User/signup/hashPassword.js";
import { validateUserData } from "../../middleware/User/signup/validateUserData.js";
import { checkEmailAndMobile } from '../../middleware/User/signup/checkEmailAndMobile.js';
import { verifyToken } from "../../middleware/User/verifyToken.js";
import { validateUpdateUserData } from "../../middleware/User/signup/validateUpdateUserData.js";

const userRouter = express.Router()

userRouter.post('/signup', checkEmailAndMobile, validateUserData, hashPassword, signUp)
userRouter.post('/signin', signIn)
userRouter.put('/updateInfo', verifyToken, checkEmailAndMobile, validateUpdateUserData, updateInfo)
userRouter.delete('/deleteAccount', verifyToken,  deleteAccount)
userRouter.get('/userInfo', verifyToken,  getUserInfo)
userRouter.get('/accountinfo/:id', verifyToken,  getAnotherAccountInfo)
userRouter.put('/updatePassword', verifyToken, updatePassword)
userRouter.post('/forgotpassword', forgotPassword)
userRouter.post('/resetPassword', resetPassword)
userRouter.get('/recoveryAccount', verifyToken, getAllAccountsForRecoveryAccount)



export default userRouter;