const express = require("express");
const { getOrders, updateStatus } = require("../controllers/riderController");
const token_auth = require("../middlewares/token-auth");
const router = express.Router();

router.get("/orders", getOrders);
router.patch("/status", updateStatus);

module.exports = router;
