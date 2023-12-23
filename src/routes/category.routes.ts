import { createCategory } from "../controllers/category.controllers";
import { Router } from "express";

const router = Router();

router.post('/', createCategory)
router.delete('/', createCategory)
const categoryRoutes = router
export default categoryRoutes