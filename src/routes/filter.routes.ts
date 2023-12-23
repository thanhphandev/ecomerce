
import { Router } from "express";
import { checkAdmin, verifyAccessToken } from "../middlewares/verify_token";

import { searchUser } from "../controllers/filter.controllers";
const router = Router();

router.get('/users', verifyAccessToken, searchUser)

export default router

