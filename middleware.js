const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be signed in first");
		return res.redirect("/login");
	}
	next();
};

const ignorePaths = {
	"/login": true,
	"/register": true,
	"/logout": true,
	"/load-more": true,
};

// Middleware storeReturnTo
module.exports.storeReturnTo = (req, res, next) => {
	// Almacena la URL previa en la sesión del usuario
	if (!ignorePaths[req.originalUrl]) {
		req.session.previousUrl = req.originalUrl;
	} else {
		req.session.previousUrl = req.session.previousUrl;
	}

	// Recupera la URL previa de la sesión del usuario
	const previousUrl = req.session.previousUrl;

	console.log("original path", req.originalUrl);
	console.log("previous URL", previousUrl);

	// Establece la URL previa en res.locals para que esté disponible en las vistas
	res.locals.returnTo = previousUrl;
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that");
		return res.redirect(`/campgrounds/${id}`);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that");
		return res.redirect(`/campgrounds/${id}`);
	} else {
		next();
	}
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
