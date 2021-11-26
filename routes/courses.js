const express = require("express");
const router = express.Router();
const courses = require("../controllers/courses");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateCourse, isAuthor } = require("../middleware");
const Course = require("../models/course");
const multer = require('multer');
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(courses.index))
    .post(isLoggedIn, upload.array("image"), validateCourse, catchAsync(courses.addCourse));


router.get("/new", isLoggedIn, courses.renderAddForm);

router.route("/:id")
    .get(catchAsync(courses.showCourse))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCourse, catchAsync(courses.updateCourse))
    .delete(isLoggedIn, isAuthor, catchAsync(courses.delete));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(courses.renderEditForm));

module.exports = router;