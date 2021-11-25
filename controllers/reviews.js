const Course = require("../models/course");
const Review = require("../models/review");

module.exports.addNewReview = async (req, res) => {
    const courseToReview = await Course.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    courseToReview.reviews.push(review)
    await review.save()
    await courseToReview.save()
    req.flash("success", "Review Added!")
    res.redirect(`/courses/${courseToReview._id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted!")
    res.redirect(`/courses/${id}`)
};