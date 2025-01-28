import axiosInstance from "./axiosInstance";

const uploadImage=async(imageFile)=>{
    const formData=new FormData();
    formData.append('image',imageFile);

    try{
        const response=await axiosInstance.post('/upload-image',formData,{
            headers:{
                'Content-Type':"multipart/formdata",

            }
                
        
        });
        return response.data;

    }catch(error){
            console.error("Error uploading the image: ",error);
            throw error;
    }
}

export default uploadImage;