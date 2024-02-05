const boom=require('@hapi/boom')
const { createTransport } = require("nodemailer");


const sendEmail = async (to, subject, text) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_MAIL,
        pass: process.env.APP_MAIL_PASS,
      },
    });
  const emailResponse=  await transporter.sendMail({
      to,
      subject,
      text,
      from: "saifhammad411@gmail.com",
    });

    return emailResponse
  } catch (error) {
    console.log(error?.message);
    throw boom.badRequest(error.message)
  }
};

module.exports=sendEmail