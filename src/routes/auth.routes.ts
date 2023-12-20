import { Router } from "express";
import AuthControllers from "../controllers/auth.controllers";

const router = Router();

router.post('/signup', AuthControllers.signUp)
router.post('/login', AuthControllers.Login)
router.get('/refresh', AuthControllers.refreshToken)
router.get('/logout', AuthControllers.Logout)

const authRoutes = router;
export default authRoutes;