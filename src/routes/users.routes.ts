import { Router } from "express";
import UserControllers from "../controllers/user.controllers";
import { checkAdmin, verifyAccessToken } from "../middlewares/verify_token";


const router = Router();

router.get('/', checkAdmin, UserControllers.getAllUsers);
router.get('/:id', checkAdmin, UserControllers.getUser);
router.put('/update', checkAdmin, UserControllers.updateUser)
router.delete('/delete', checkAdmin ,UserControllers.deleteAllUser);
router.delete('delete/:id', checkAdmin ,UserControllers.deleteUser);
router.post('/ban', checkAdmin, UserControllers.banUser)
router.post('/unban', checkAdmin, UserControllers.unbanUser)
export default router