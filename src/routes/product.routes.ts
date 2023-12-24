import { createProduct , editProduct, getAllProduct, getProduct} from "../controllers/product.controllers";
import { Router } from "express";

const router = Router();

router.post('/', createProduct)
router.get('/', getAllProduct)
router.get('/:id', getProduct)
router.put('/:id', editProduct)
const productRoutes = router
export default productRoutes