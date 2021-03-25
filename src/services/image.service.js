const httpStatus = require('http-status');
const { Image } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get image by id
 * @param {ObjectId} id
 * @returns {Promise<Image>}
 */
const getImageById = async (id) => {
  const image = Image.findOne({
    filename: id,
  });
  if (!image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  return image;
};

module.exports = {
  getImageById,
};
