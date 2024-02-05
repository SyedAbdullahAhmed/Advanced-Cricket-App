const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const userRepo = require("../repositories/user");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

function generateOTP(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp.toString();
}

exports.createNewUser = async (payLoad) => {
  try {
    if (payLoad.password) {
      const hashedPassword = await bcrypt.hash(payLoad.password, 10);
      payLoad.password = hashedPassword;
    }
    return await userRepo.createNewUser(payLoad);
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.signIn = async (payLoad) => {
  try {
    const { emailAddress, password } = payLoad;

    // find user
    const user = await userRepo.findOne(emailAddress);
    if (!user) throw boom.unauthorized("user not found");

    // verify password
    const verified = await bcrypt.compare(password, user.password);
    if (!verified) throw boom.unauthorized("invalid credentials");

    // add data in token
    const tokenData = {
      id: user._id,
      emailAddress: user.emailAddress,
      fullName: user.fullName,
      role : user.role
    };

    // set token exppiration time
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });

    return token;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.signInMobile = async (payLoad) => {
  try {
    const user = await userRepo.findByPhone(payLoad.phoneNumber);
    if (!user) throw boom.unauthorized("user not found");

    const tokenData = {
      id: user._id,
      fullName: user.fullName,
      emailAddress: user.emailAddress,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });

    return token;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.updateUserInfo = async (id, payLoad) => {
  try {
    let updatedData = {};

    //push body data in object
    for (const field in payLoad) {
      updatedData[`${field}`] = payLoad[field];
    }

    if (updatedData.hasOwnProperty("password"))
      updatedData.password = await bcrypt.hash(payLoad.password, 10);
    
    const updated = await userRepo.updateById(id, updatedData);

    if (!updated) throw boom.badRequest("update failed");

    return updated;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.socialLogin = async (payLoad) => {
  try {
    const { emailAddress } = payLoad;
    //check if exists
    let user = (await userRepo.findOne(emailAddress)) || false;

    if (!user) user = await userRepo.createNewUser(payLoad);

    const tokenData = {
      id: user._id,
      fullName: user.fullName,
      emailAddress: user.emailAddress,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.forgotPassword = async (payLoad) => {
  try {
    const { emailAddress } = payLoad;
    const user = await userRepo.findOne(emailAddress);
    if (!user) throw boom.badRequest("email not found");

    const otp = generateOTP(4);
    await userRepo.updateById(user._id, {
      forgotOtp: otp,
      forgotOtpExpiry: Date.now() + 15 * 60 * 1000,
    });

    const response = await sendEmail(
      user.emailAddress,
      "Khelaao",
      `please use the following otp: ${otp}`
    );
    return response;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.resetPassword = async (payLoad) => {
  try {
    const { emailAddress, otp, password } = payLoad;

    const user = await userRepo.validateOtp(emailAddress, otp);

    if (!user) throw boom.badRequest("invalid otp or otp has expired");

    console.log("verified");
    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await userRepo.updateById(user._id, {
      forgotOtp: null,
      forgotOtpExpiry: null,
      password: hashedPassword,
    });

    return updated;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

// exports.sendOTP = async (payLoad) => {
//   try {
//     const otpResponse = await client.verify.v2
//       .services(TWILIO_SERVICE_SID)
//       .verifications.create({
//         to: `+92${payLoad.phoneNumber}`,
//         channel: "sms",
//       });

//     if (otpResponse) {
//       return otpResponse;
//     }
//     throw boom.badRequest("failed to send otp");
//   } catch (error) {
//     throw boom.badRequest(error.message);
//   }
// };

// exports.verifyOTP = async (payLoad) => {
//   try {
//     const verificationResponse = await client.verify.v2
//       .services(TWILIO_SERVICE_SID)
//       .verificationChecks.create({
//         to: `+92${payLoad.phoneNumber}`,
//         code: payLoad.otp,
//       });

//     if (verificationResponse && payLoad.emailAddress && payLoad.fullName && payLoad.phoneNumber) {
//       const user = await userRepo.createMobileUser(
//         payLoad.emailAddress,
//         payLoad.fullName,
//         payLoad.phoneNumber
//       );

//       if (!user) throw boom.badRequest("unable to create user");
//       return user;
//     }

//     if(verificationResponse){
//       return verificationResponse
//     }

//     throw boom.badRequest("incorrect otp or expired");
//   } catch (error) {
//     throw boom.badRequest(error.message);
//   }
// };
