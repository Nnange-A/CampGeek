const multer = require("multer"); // for parsing multipart/form-data
const express = require("express");

const catchAsync = require("../utils/catchAsync");

const campgrounds = require("../controllers/campgrounds");

const { validateCampground, storeReturnTo, isLoggedIn, isCampgroundAuthor } = require("../middleware");

const { storage } = require("../cloudinary")


const upload = multer({ storage }); // for parsing multipart/form-data
const router = express.Router();



router.route("/")
    .get(storeReturnTo, catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("images"), validateCampground, catchAsync(campgrounds.createCampground));


router.get("/new", storeReturnTo, isLoggedIn, campgrounds.renderNewCampgroundForm);


router.route("/:id")
    .get(storeReturnTo, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isCampgroundAuthor, upload.array("images"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(storeReturnTo, isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.deleteCampground));


router.get("/:id/edit", storeReturnTo, isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.renderEditCampgroundForm));



module.exports = router;