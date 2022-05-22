const express = require("express")
const { createUser,loginUser,accessUser,searchUser,getUser } = require('../controllers/express/userController');
const {jsonExpressAuth} = require("../middlewares/authentication.js");

const router = express.Router();

router.post('/create', createUser);
router.post('/search', jsonExpressAuth, searchUser);
router.post('/login', loginUser);
router.post('/access', jsonExpressAuth, accessUser);
router.post('/get', jsonExpressAuth, getUser);

module.exports = router;