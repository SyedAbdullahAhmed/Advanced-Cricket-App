const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(authHeader)
  const token=authHeader && authHeader.split(' ')[1]
 
  
  if (!token) {
    return res.status(401).json("No token found!!!");
  }
  jwt.verify(token,process.env.TOKEN_SECRET_KEY,(err,user)=>{
    if(err) return res.status(403).json({response:false,message:err.message})
    req.user=user
    next()
  })

  
  const bearer = token.split(" ");
};
