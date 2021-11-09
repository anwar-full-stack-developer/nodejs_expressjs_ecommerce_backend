//Require Mongoose
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;


const CategorySchema = new mongoose.Schema({
  title: {
    type: Schema.Types.String,
    min: 3,
    max: 120,
    required: true,
    index: true,
    trim: true,
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
    type: Schema.Types.String,
  },
  parent_category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  isActive: {
    type: Schema.Types.Boolean,
    default: true,
  },

  created: { type: Schema.Types.Date },
  updated: { type: Date, default: Date.now },
});

module.exports = CategorySchema;
