const mongoose = require("mongoose");
var validator = require("email-validator");
const createField = require("../common/commonFields");

const userSchema = new mongoose.Schema({
  fullName: createField(String, true, false, ""),
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.validate(value);
      },
      message: "Invalid email address",
    },
  },
  dateOfBirth: createField(String, false, false, ""),
  profilePicture: createField(String, false, false, ""),
  bio: createField(String, false, false, ""),
  phoneNumber: {
    type: String,
    required: false,
    unique: false,
    validate: {
      validator: function (value) {
        return value.length === 10;
      },
      message:
        "Phone number must be a 10-digit number without spaces or special characters.",
    },
    default:undefined

  },
  address: createField(String, false, false, ""),
  gender: createField(String, false, false, ""),
  town: createField(String, false, false, ""),
  city: {
    type: String,
    required: false,
    unique: false,
  },
  country: createField(String, false, false, ""),
  password: createField(String, false, false, undefined),
  role: createField(String, false,false, "audience"),
  socialLogin:createField(String,false,false,undefined),
  forgotOtp:createField(String,false,false,undefined),
  forgotOtpExpiry:createField(String,false,false,undefined)
});

module.exports = mongoose.model("User", userSchema);
