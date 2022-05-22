const express = require("express");
const { createConversation,getConversationsByUser } = require('../controllers/express/conversationController');
const { jsonExpressAuth } = require("../middlewares/authentication.js");
const router = express.Router();
router.post('/create',jsonExpressAuth, createConversation);
router.post('/getallbyuser',jsonExpressAuth, getConversationsByUser);
module.exports = router;