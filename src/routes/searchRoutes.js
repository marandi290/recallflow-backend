const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const { searchQuerySchema } = require("../validators/searchValidator");
const searchController = require("../controllers/searchController");

router.get(
    "/",
    validate(searchQuerySchema, "query"),
    searchController.searchAll
);

module.exports = router;
