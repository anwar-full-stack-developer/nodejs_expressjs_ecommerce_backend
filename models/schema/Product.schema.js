//Require Mongoose
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
  title: {
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
    slug: "title",
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
  // category: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Category'
  // },
  thumbnail: {
    type: Schema.Types.String,
    lowercase: true
  },
  images: {
    type: Schema.Types.Array,
    lowercase: true
  },
  stock: {
    type: Schema.Types.Number,
    required: true,
    default: 1    
  },
  //features
  size: {
    type: Schema.Types.Array,
    default: []
    // uppercase: true,
    // enum: ["XS", "SM", "LG", "XXL", "Small", "Medium", "Large", "Babies"]
  },
  product_model: {
    type: Schema.Types.Array,
    default: []
    // enum: ["Xs", "Xs Max"]
  },
  color: {
    type: Schema.Types.Array,
    default: []
    // uppercase: true,
    // enum: ["Silver", "Gray", "Gold", "Black", "White"]
  },
  capacity: {
    type: Schema.Types.Array,
    default: []
    // uppercase: true,
    // enum: ["32 GB", "64 GB", "128 GB", "512 GB", "1 TB"]
  },
  
  ratting: {
    type: Schema.Types.Number,
    default: 1
  },
  isPublished: {
    type: Schema.Types.Boolean,
    default: true
  },
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  created: { type: Date },
  updated: { type: Date, default: Date.now },
  tnc: {
    type: Schema.Types.Boolean,
    default: true,
    required: true    
  },
  
});

module.exports = ProductSchema;