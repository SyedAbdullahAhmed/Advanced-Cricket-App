const express = require("express");
const router = express.Router();
const {
  createNewUser,
  signIn,
  currentUser,
  updateUserInfo,
  socialLogin,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  mobileSignIn,
} = require("../controllers/user");
const { verifyToken } = require("../middleware/authentication");
const { imageUpload } = require("../middleware/imageUpload")

router.post("/signUp", createNewUser);
router.post("/signIn", signIn);
router.get("/currentUser", verifyToken, currentUser);
router.put("/updateUserInfo/:id", imageUpload, verifyToken, updateUserInfo);
router.get("/socialLogin", socialLogin);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post('/mobileSignIn', mobileSignIn)

// router.post('/sendOtp',sendOTP)
// router.post('/verifyOtp',verifyOTP)


module.exports = router;
