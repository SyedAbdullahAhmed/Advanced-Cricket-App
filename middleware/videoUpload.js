const cloudinary = require('cloudinary').v2

cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.API_KEY,
     api_secret: process.env.API_SECRET
});

exports.videoUpload = async (req, res, next) => {
     try{
          // upload file
          if (!req.files || !req.files.file) {
               return res.status(400).json({ error: 'No file uploaded' });
          }
     
          const videoFile = req.files.file;
     
          // upload to cloudniary
          cloudinary.uploader.upload_large(videoFile.tempFilePath, { resource_type: "video" }, (err, result) => {
               if (result) {
                    // set the url
                    req.body.video = result.secure_url;
                    next()
               } else {
                    console.error(err);
                    res.status(500).json({ error: 'Error uploading the video' });
               }
          });
     }
     catch(error){
          console.log(error)
     }
}