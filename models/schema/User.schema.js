//Require Mongoose
const mongoose = require("mongoose");
const { USER_TYPE } = require("./../../constants/user.constant");
//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_type: {
    type: Schema.Types.String,
    required: true,
    enum: USER_TYPE,
  },
  first_name: {
    type: Schema.Types.String,
    min: 3,
    max: 18,
    required: true,
    index: true,
    trim: true,
  },
  last_name: {
    type: Schema.Types.String,
    min: 3,
    max: 18,
    trim: true,
  },
  phone_number: {
    type: Schema.Types.String,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: Schema.Types.String,
  },
  token: {
    type: Schema.Types.String,
  },
  password_reset_token: {
    type: Schema.Types.String,
  },
  gender: {
    type: Schema.Types.String,
  },
  city: {
    type: Schema.Types.String,
  },
  country: {
    type: Schema.Types.String,
  },
  street: {
    type: Schema.Types.String,
  },
  isSuperAdmin: {
    type: Schema.Types.Boolean,
    default: false,
  },

  isAdmin: {
    type: Schema.Types.Boolean,
    default: false,
  },
  isActive: {
    type: Schema.Types.Boolean,
    default: true,
  },
  isBanned: {
    type: Schema.Types.Boolean,
    default: false,
  },
  isSuspend: {
    type: Schema.Types.Boolean,
    default: false,
  },
  profile_picture: {
    type: Schema.Types.Array,
    default: []
  },
  created: { type: Date },
  updated: { type: Date, default: Date.now },
  dob: { type: Date },
  tnc: {
    type: Schema.Types.Boolean,
    default: true,
    required: true,
  },
});

module.exports = UserSchema;
