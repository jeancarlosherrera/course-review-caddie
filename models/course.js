const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
});

const opts = { toJSON: { virtuals: true } };

const courseSchema = new Schema({
    name: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

courseSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href="/courses/${this._id}"> ${this.name}</a></strong>
    <p> ${this.description.substring(0, 20)}...</p>`
});

courseSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        })
    }
});

module.exports = mongoose.model("Course", courseSchema);
