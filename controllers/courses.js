const Course = require("../models/course");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const allCourses = await Course.find({})
    res.render("courses/index", { allCourses })
};

module.exports.renderAddForm = (req, res) => {
    res.render("courses/new")
};

module.exports.addCourse = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.course.location,
        limit: 1
    }).send()
    const addCourse = new Course(req.body.course)
    addCourse.geometry = geoData.body.features[0].geometry
    addCourse.images = req.files.map(el => ({ url: el.path, filename: el.filename }))
    addCourse.author = req.user._id
    await addCourse.save()
    req.flash("success", "Course Added Successfully!")
    res.redirect(`/courses/${addCourse._id}`)
};

module.exports.showCourse = async (req, res) => {
    const selectedCourse = await Course.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if (!selectedCourse) {
        req.flash("error", "Course Not Found")
        return res.redirect("/courses")
    }
    res.render("courses/show", { selectedCourse })
};

module.exports.renderEditForm = async (req, res) => {
    const selectedCourse = await Course.findById(req.params.id)
    if (!selectedCourse) {
        req.flash("error", "Course Not Found")
        return res.redirect("/courses")
    }
    res.render("courses/edit", { selectedCourse })
};

module.exports.updateCourse = async (req, res) => {
    const { id } = req.params
    const updatedCourse = await Course.findByIdAndUpdate(id, { ...req.body.course })
    const imgs = req.files.map(el => ({ url: el.path, filename: el.filename }))
    updatedCourse.images.push(...imgs)
    await updatedCourse.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updatedCourse.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Course Updated Successfully!")
    res.redirect(`/courses/${updatedCourse.id}`)
};

module.exports.delete = async (req, res) => {
    const { id } = req.params
    await Course.findByIdAndDelete(id)
    req.flash("success", "Course Deleted!")
    res.redirect("/courses")
};