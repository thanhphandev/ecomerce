import { Router } from "express";
import AuthControllers from "../controllers/auth.controllers";
import { OTPLimit } from "../helpers/limited_request";

const router = Router();

router.post('/signup', AuthControllers.signUp)
router.post('/login', AuthControllers.Login)
router.get('/refresh', AuthControllers.refreshToken)
router.post('/forgot-password', OTPLimit, AuthControllers.forgotPassword)
router.post('/resend_otp', OTPLimit, AuthControllers.resendOTP)
router.post('/reset-password', AuthControllers.resetPassword)
router.get('/logout', AuthControllers.Logout)

const authRoutes = router;
export default authRoutes;