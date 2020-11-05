import { request } from "express";
import {
  AuthController,
  CheckIsSendEmail,
  CheckToken,
} from "../controllers/Admin/Auth.Controller";
import { HandelStatus } from "../controllers/HandelAction";
import { UserController } from "../controllers/User/user.controller";

var express = require("express");
var router = express.Router();
var multer = require("multer");
var EMailController = require("../controllers/Email/Email.controller");
const imageUploader = multer({ dest: "public/" }); // (**)
router.post(
  "/sendEmail",
  CheckToken,
  CheckIsSendEmail,
  imageUploader.single("file"),
  UserController.UploadFile,
  EMailController.SendEmail
);
router.post("/login", AuthController.Login);
router.post("/logout", AuthController.Logout);
router.post("/checkLogin", CheckToken, (req, res) => {
  req.send(HandelStatus(200));
});

module.exports = router;
