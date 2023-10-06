const  express =  require("express");
const router = express.Router();

const {
    registerUser,
    logout,
    loginUser,
    refreshTokenController,
    
  } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login",loginUser)
router.get("/refreshtoken",refreshTokenController)
router.get("/logout",logout)


module.exports =  router;