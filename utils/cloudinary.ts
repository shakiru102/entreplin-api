import cloudinary from "cloudinary"
import env from 'dotenv'

env.config()

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

 })
 

export const saveFile = async (path: any, folder: string, id?: string) => {

    try {
       const savedFile = await cloudinary.v2.uploader.upload(path, { 
        folder: folder,
        ...(id && { public_id: id } ) 
       })
       return { savedFile }
    } catch (error: any) {
        return { error }
    }
}

export const deleteFile = async (path: any) => { 
    try {
        const fileDeleted = await cloudinary.v2.uploader.destroy(path)
        return { fileDeleted }
     } catch (error: any) {
         return { error }
     }
}