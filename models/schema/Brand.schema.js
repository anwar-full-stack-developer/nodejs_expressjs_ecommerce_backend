//Require Mongoose
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const BrandSchema = new mongoose.Schema({
  name: {
    type: Schema.Types.String,
    min: 3,
    required: true,
    index: true,
    trim: true
  },
  slug: {
    type: Schema.Types.String,
    trim: true,
    unique: true,
    index: true,
    slug: "name",
    slugOn: {
      save: true,
      update: true,
      updateOne: true,
      updateMany: true,
      findOneAndUpdate: true,
    },
  },  
  description: {
    type: Schema.Types.String
  },
  
  logo: {
    // type: Schema.Types.String,
    type: Schema.Types.Array,
    lowercase: true
  },
  
  isPublished: {
    type: Schema.Types.Boolean,
    default: true
  },
  created: { type: Date },
  updated: { type: Date, default: Date.now },
  tnc: {
    type: Schema.Types.Boolean,
    default: true,
    required: true    
  },
  
});

module.exports = BrandSchema;