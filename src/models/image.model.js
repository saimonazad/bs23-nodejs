const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const path = require('path');

const ImageSchema = mongoose.Schema({
  filename: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

ImageSchema.virtual('uniqueId').get(function () {
  return this.filename.replace(path.extname(this.filename), '');
});

// add plugin that converts mongoose to json
ImageSchema.plugin(toJSON);

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
