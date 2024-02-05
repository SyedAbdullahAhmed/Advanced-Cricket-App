const adminService = require("../services/admin");

module.exports.getCount = async (req, res, next) => {
  try {
    const count = await adminService.getCount();
    if (!count)
      res.status(400).json({ response: false, message: "failed to get count" });
    res.status(200).json({ response: true, count: count });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};
