import { Router } from "express";
import UserControllers from "../controllers/user.controllers";
import { verifyAccessToken } from "../middlewares/verify_token";
const router = Router();

router.get('/', verifyAccessToken,UserControllers.getAllUsers)
router.delete('/', UserControllers.deleteAllUser);
export default router