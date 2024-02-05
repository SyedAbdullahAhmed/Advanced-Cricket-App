const boom = require("@hapi/boom");
const adminRepo = require("../repositories/admin");

exports.getCount = async () => {
  try {
    const count = await adminRepo.getCount();
    console.log(`count:${count}`);
    if (!count) throw boom.badRequest("unable to get count");
    return count;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};
