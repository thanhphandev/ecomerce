import { Router } from "express";
import AuthControllers from "../controllers/auth.controllers";

const router = Router();

router.post('/signup', AuthControllers.signUp)
router.post('/login', AuthControllers.Login)

const authRoutes = router;
export default authRoutes;