import { Router } from "express";
import UserControllers from "../controllers/user.controllers";
import { checkAdmin, verifyAccessToken } from "../middlewares/verify_token";
const router = Router();

router.get('/', verifyAccessToken, UserControllers.getAllUsers);
router.get('/:id', verifyAccessToken, UserControllers.getUser);
router.put('/update', verifyAccessToken, UserControllers.updateUser)
router.delete('/delete', checkAdmin ,UserControllers.deleteAllUser);
router.delete('delete/:id', verifyAccessToken ,UserControllers.deleteUser);
router.post('/ban', verifyAccessToken, UserControllers.banUser)
router.post('/unban', verifyAccessToken, UserControllers.unbanUser)
export default router