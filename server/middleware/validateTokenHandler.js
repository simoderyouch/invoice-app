
const jwt = require("jsonwebtoken");


const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];

  jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECERT,
      (err, decoded) => {
          if (err) return res.status(403).json({ message: 'Forbidden' }); //invalid token
          req.user = decoded.user;
 
          next();
      }
  );
}

module.exports = validateToken;