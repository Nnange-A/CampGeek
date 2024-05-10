const mongoose = require("mongoose");

const Review = require("./review");

const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/h_150");
});


const CampgroundSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
}, { toJSON: { virtuals: true } });

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<h6><a href="/campgrounds/${this._id}">${this.title}</a></h6><p>${this.location}</p>`;
})


CampgroundSchema.post("findOneAndDelete", async function(campground) {

    if (campground.reviews.length) {

        await Review.deleteMany({ _id: { $in: campground.reviews } });

    }

});


module.exports = mongoose.model("Campground", CampgroundSchema);