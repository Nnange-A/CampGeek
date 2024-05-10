/* 
const { v2: cloudinary } = require("cloudinary"); */
// OR
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
    // secure IS ALREADY SET TO true BY DEFAULT
    /* secure: true, */
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "CampGeek",
        allowedFormats: ["jpeg", "png", "jpg"],
    }, 
})



module.exports = {
    cloudinary,
    storage
}