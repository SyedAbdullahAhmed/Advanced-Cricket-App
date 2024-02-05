const cloudinary = require('cloudinary').v2

cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.API_KEY,
     api_secret: process.env.API_SECRET
});

exports.imageUpload = async (req, res, next) => {
     try {
          // upload file
          if (!req.files) {
               // return res.status(400).json({ error: 'No file uploaded' });
               console.log('no files upload')
               next()
          }
          else{
               if(req.files.image) {
                    const file = req.files.image;
          
                    // upload to cloudniary
                    await cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
                         if (result) {
                              // set the url
                              req.body.image = result.secure_url;
                              console.log(req.body.image)
                              next()
                         } else {
                              console.error(err);
                              res.status(500).json({ error: 'Error uploading the image' });
                         }
                    });
               }
               if(req.files.profilePicture) {
                    const file = req.files.profilePicture;
          
                    // upload to cloudniary
                    await cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
                         if (result) {
                              // set the url
                              req.body.profilePicture = result.secure_url;
                              console.log(req.body.profilePicture)
                              next()
                         } else {
                              console.error(err);
                              res.status(500).json({ error: 'Error uploading the image' });
                         }
                    });
               }
          }
     }
     catch (error) {
          console.log(error)
     }
}