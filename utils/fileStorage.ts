import multer from "multer";

const storage = multer.diskStorage({
     filename: (req, file, callback) => {
         if(file) callback(null, new Date().toISOString() + '-' + file.originalname)
         else callback(new Error('Invalid file'), '')
     },
})

const upload = multer({
    storage
})

export default upload