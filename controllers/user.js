const userServices = require("../services/user");
const userRepo = require("../repositories/user");

module.exports.createNewUser = async (req, res, next) => {
  try {
    const payLoad = {
      fullName: req.body.fullName,
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      role: req.body.role,
      phoneNumber: req.body.phoneNumber,
    };

    const userExists = await userRepo.findOne(payLoad.emailAddress);
    if (userExists)
      return res
        .status(400)
        .json({ response: false, message: "user email already exists" });

    if (payLoad.phoneNumber) {
      const userPhone = await userRepo.findByPhone(payLoad.phoneNumber);
      if (userPhone) {
        return res
          .status(400)
          .json({ response: false, message: "user phone already exists" });
      }
    }

    const newUser = await userServices.createNewUser(payLoad);
    return res.status(200).send(newUser);
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.signIn = async (req, res, next) => {
  try {
    const payLoad = {
      emailAddress: req.body.emailAddress,
      password: req.body.password,
    };
    const token = await userServices.signIn(payLoad);
    if (!token)
      return res
        .status(401)
        .json({ response: false, message: "signIn failed" });
    res.status(200).json({ response: true, token });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.currentUser = async (req, res, next) => {
  try {
    res.status(200).json({ response: true, user: req.user });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const payLoad = req.body;
    console.log(payLoad)
    const updatedUser = await userServices.updateUserInfo(id, payLoad);
    if (!updatedUser)
      return res
        .status(400)
        .json({ response: false, message: "update failed" });
    res.status(200).json({ response: true, message: "updated succesfully" });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.socialLogin = async (req, res, next) => {
  try {
    const payLoad = {
      emailAddress: req.body.emailAddress,
      profilePicture: req.body.profilePicture,
      fullName: req.body.fullName,
      socialLogin: "Google",
    };
    const token = await userServices.socialLogin(payLoad);
    if (!token)
      res.status(400).json({ response: false, message: "unable to signin" });
    res.status(200).json({ response: true, token: token });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const payLoad = {
      emailAddress: req.body.emailAddress,
    };
    const response = await userServices.forgotPassword(payLoad);
    if (!response)
      return res.status(400).json({
        response: false,
        message: "unable to sent otp or incorrect email",
      });
    res.status(200).json({
      response: true,
      message: "otp  sent successfuly on email",
    });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const payLoad = {
      emailAddress: req.body.emailAddress,
      otp: req.body.otp,
      password: req.body.password,
    };

    const updated = await userServices.resetPassword(payLoad);
    if (!updated)
      return res
        .status(400)
        .json({ response: false, message: "unable to reset password" });
    res
      .status(200)
      .json({ response: true, message: "password reset successful" });
  } catch (error) {
    res.status(500).send({ response: false, message: error.message });
  }
};

//otp

module.exports.sendOTP = async (req, res, next) => {
  const payLoad = {
    otp: req.body.otp,
    phoneNumber: req.body.phoneNumber,
  };

  try {
    const otpResponse = await userServices.sendOTP(payLoad);
    if (!otpResponse)
      return res
        .status(400)
        .json({ response: false, message: "failed to send otp" });
    res.status(200).json({ response: true, message: "otp sent successfuly" });
  } catch (error) {
    res
      .status(error?.status || 400)
      .send(error?.message || "something went wrong");
  }
};

module.exports.verifyOTP = async (req, res, next) => {
  try {
    const payLoad = {
      emailAddress: req.body?.emailAddress || false,
      phoneNumber: req.body.phoneNumber,
      fullName: req.body?.fullName || false,
      otp: req.body.otp,
    };

    const verified = await userServices.verifyOTP(payLoad);
    if (!verified)
      res.status(400).json({ response: false, message: "verification failed" });
    res
      .status(200)
      .json({ response: true, message: "otp verified successfuly" });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.mobileSignIn = async (req, res, next) => {
  try {
    const payLoad = {
      phoneNumber: req.body.phoneNumber,
    };
    const token = await userServices.signInMobile(payLoad);
    if (!token)
      return res
        .status(401)
        .json({ response: false, message: "sign in failed" });
    res.status(200).json({ response: true, token: token });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};
