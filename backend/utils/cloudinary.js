import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: "dp4ljnoq5",
    api_key: "288514684828149",
    api_secret: "BDb5wgQ6Z-UFwjdtJ6Y94lwfNCo"
});
export default cloudinary;