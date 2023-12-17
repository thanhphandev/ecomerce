import mongoose from "mongoose";
import 'dotenv/config'
const URIv1:string = process.env.URIVer1 || ''
const connectV1 = async() => {
    try {
        await mongoose.connect(URIv1)
        console.log(`Connected to database V1`)
    } catch (error:any) {
        console.log(error.stack)
    }
}
export default connectV1;