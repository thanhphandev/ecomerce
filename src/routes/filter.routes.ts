
import { Router } from "express";
import { checkAdmin, verifyAccessToken } from "../middlewares/verify_token";

import { searchProduct, searchUser } from "../controllers/filter.controllers";
const router = Router();

router.get('/users', verifyAccessToken, searchUser)
router.get('/products', verifyAccessToken, searchProduct)

export default router

