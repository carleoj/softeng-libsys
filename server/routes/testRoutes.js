const express = require("express");
const router = express.Router();

const { fetchAllRows } = require("../controllers/testController");

router.get('/get-all-rows/', fetchAllRows);

module.exports = router;