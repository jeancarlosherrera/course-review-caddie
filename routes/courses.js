const express = require("express");
const router = express.Router();
const courses = require("../controllers/courses");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateCourse, isAuthor } = require("../middleware");
const Course = require("../models/course");

router.get("/", catchAsync(courses.index));

router.get("/new", isLoggedIn, courses.renderAddForm);

router.post("/", isLoggedIn, validateCourse, catchAsync(courses.addCourse));

router.get("/:id", catchAsync(courses.showCourse));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(courses.renderEditForm));

router.put("/:id", isLoggedIn, isAuthor, validateCourse, catchAsync(courses.updateCourse));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(courses.delete));

module.exports = router;