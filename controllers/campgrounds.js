const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

// module.exports.index = async (req, res) => {
// 	const campgrounds = await Campground.find({});
// 	res.render("campgrounds/index", { campgrounds });
// };

const pageSize = 3; // Cantidad de campamentos por página

module.exports.index = async (req, res) => {
	const totalCampgrounds = await Campground.countDocuments({});

	const totalPages = Math.ceil(totalCampgrounds / pageSize);

	const campgrounds = await Campground.find({});

	res.render("campgrounds/index", { campgrounds, totalPages });
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");
	if (!campground) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}

	res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	const imgs = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	campground.images.push(...imgs);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	await campground.save();
	req.flash("success", "Successfully updated campground");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteImages = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);

	if (!camp) {
		req.flash("error", "Campground not found");
		return res.redirect("/campgrounds");
	}

	const { deleteImages } = req.body;

	if (deleteImages && deleteImages.length > 0) {
		// Eliminar las imágenes seleccionadas
		for (const filename of deleteImages) {
			// Lógica para eliminar la imagen de tu sistema de almacenamiento (p. ej. Cloudinary)
			// Ejemplo:
			await cloudinary.uploader.destroy(filename);
		}

		// Actualizar el campamento para eliminar las imágenes
		camp.images = camp.images.filter(
			(img) => !deleteImages.includes(img.filename)
		);
		await camp.save();

		req.flash("success", "Images deleted successfully");
	} else {
		req.flash("error", "No images selected for deletion");
	}

	res.redirect(`/campgrounds/${id}/edit`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "successfully deleted campground");
	res.redirect("/campgrounds");
};
