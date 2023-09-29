import multer from "multer";

const storage = multer.diskStorage({
     filename: (req, file, callback) => {
         if(file) callback(null, new Date().toISOString() + '-' + file.originalname)
         else callback(new Error('file is too large'), '')
     },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

export default upload