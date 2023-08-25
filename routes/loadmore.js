const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const loadmore = require("../controllers/loadmore");

router.route("/load-more").get(catchAsync(loadmore.loadMore));

module.exports = router;
