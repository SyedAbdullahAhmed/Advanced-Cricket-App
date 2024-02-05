const model = require("../models/user");

exports.createNewUser = async (payLoad) => {
  return model.create(payLoad);
};

exports.findOne = async (emailAddress) => {
  return model.findOne({ emailAddress });
};

exports.findByPhone=async(phoneNumber)=>{
  return model.findOne({phoneNumber})
}

exports.updateById = async (id, payLoad) => {
  return model.findOneAndUpdate({ _id: id }, { $set: payLoad }, { new: true });
};

exports.validateOtp = async (emailAddress, otp) => {
  return model.findOne({
    emailAddress,
    forgotOtp: {
      $eq: otp,
    },
    forgotOtpExpiry: {
      $gt: Date.now(),
    },
  });
};

exports.getUsersCount=()=>{
  return model.countDocuments({})
}

// exports.createMobileUser = async (emailAddress, fullName,phoneNumber) => {
//   return model.create({ emailAddress, fullName,phoneNumber });
// };
