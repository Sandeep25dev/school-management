const express = require("express");
const router = express.Router();
const { addSchool, fetchSchools } = require("../controllers/schoolController");

router.post("/addSchool", addSchool);

router.get("/listSchools", fetchSchools);

module.exports = router;
