import express, { Request, Response, NextFunction } from 'express';
import { CustomError } from './common/errorObject';
import { HTTPStatus } from './common/httpStatus';
import cors, { CorsOptions } from 'cors';
import connectV1 from './database/connectV1';
import 'dotenv/config'
import userRoutes from './routes/users.routes'
import authRoutes from './routes/auth.routes';
import {client} from './database/redis'
import cookieParser from 'cookie-parser';
import filterRoutes from './routes/filter.routes'
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';


const app = express();
const PORT = process.env.PORT || 3003

app.use(express.json());
app.use(cookieParser());
const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use('/v1/users', userRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/search', filterRoutes);
app.use('/v1/category', categoryRoutes)
app.use('/v1/products', productRoutes)

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            status: 'Failed',
            error: err.message,
        });
    } else {
        console.error(err.stack);
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            error: 'Internal Server Error',
            stack: err.stack
        });
    }
});

app.listen(PORT, async () => {
    await client.connect()
    await connectV1()
    console.log(`Server running on port ${PORT} in process ${process.pid}`);
});
