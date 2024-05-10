const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");


const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {

    const campgrounds = await Campground.find({}).populate("author", "username");

    res.render("campgrounds/index", { campgrounds });

}


module.exports.renderNewCampgroundForm = (req, res) => {
    res.render("campgrounds/new");
}


module.exports.createCampground = async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();

    req.body.campground.geometry = geoData.body.features[0].geometry;

    const newCampground = new Campground(req.body.campground);

    newCampground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));

    newCampground.author = req.user._id;

    await newCampground.save();

    req.flash("success", "Successfully created campground.");

    res.redirect(`/campgrounds/${newCampground._id}`);
    
}


module.exports.showCampground = async (req, res) => {
    
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("author", "username");

    if (!campground) {
        req.flash("error", "Requested campground cannot be found. It could have been deleted, or you could have made an error in your request.");
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });

}


module.exports.renderEditCampgroundForm = async (req, res) => {

    const campground = await Campground.findById(req.params.id);

    if (!campground) {
        req.flash("error", "Requested campground cannot be found. It could have been deleted, or you could have made an error in your request.");
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });

}


module.exports.updateCampground = async (req, res) => {

    const { id } = req.params;

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();

    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true, runValidators: true });

    updatedCampground.geometry = geoData.body.features[0].geometry;

    const newImages = req.files.map(file => ({ url: file.path, filename: file.filename }));
    updatedCampground.images.push(...newImages);

    await updatedCampground.save();

    if (req.body.deleteImages) {

        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // YOU CAN CHOOSE TO AWAIT THIS OR NOT.
        }

        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        
    }

    req.flash("success", "Successfully editted campground.");

    res.redirect(`/campgrounds/${updatedCampground._id}`);

}


module.exports.deleteCampground = async (req, res) => {

    const { id } = req.params;
    
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfully deleted campground.");

    res.redirect("/campgrounds");

}