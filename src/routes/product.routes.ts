import { createProduct , getAllProduct} from "../controllers/product.controllers";
import { Router } from "express";

const router = Router();

router.post('/', createProduct)
router.get('/', getAllProduct)
const productRoutes = router
export default productRoutes