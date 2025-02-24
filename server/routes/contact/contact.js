const express = require("express");
const {
  submitContactForm,
  getInquiries,
} = require("../../controllers/contact/contact-controller");

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/get", getInquiries);

module.exports = router;
