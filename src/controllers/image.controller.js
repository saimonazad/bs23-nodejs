const fs = require('fs-extra');
const path = require('path');
const md5 = require('md5');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, imageService } = require('../services');
const randomNumber = require('../utils/libs');
const { Image } = require('../models');

const getImageById = async (req, res) => {
  console.log(req.params.imageID);
  const image = await imageService.getImageById(req.params.imageID);
  if (image) {
    image.views = image.views + 1;
    image.save();
    res.status(200).send(image);
  } else {
    res.status(httpStatus.NOT_FOUND).send('Image not found');
  }
};

const imageUpload = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      // Image Location
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`./uploads/${imgUrl}${ext}`);

      // Validate Extension
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        // you wil need the public/temp path or this will throw an error
        await fs.rename(imageTempPath, targetPath);

        // create a new image
        const newImg = new Image({
          filename: imgUrl + ext,
          uploadedBy: req.user._id,
        });

        // save the image
        const imageSaved = await newImg.save();

        // redirect to the list of images
        res.status(httpStatus.CREATED).redirect('http://localhost:3000/v1/images/'+imageSaved.uniqueId + ext);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: 'Only Images are allowed' });
      }
    }
  };

  saveImage();
};



module.exports = {
  imageUpload,
  getImageById,

};
