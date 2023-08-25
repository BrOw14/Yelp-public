const Campground = require("../models/campground");

module.exports.loadMore = async (req, res) => {
	const page = req.query.page || 1; // Página solicitada
	const pageSize = 3;

	const startIndex = (page - 1) * pageSize;
	const campgrounds = await Campground.find({})
		.skip(startIndex)
		.limit(pageSize);

	res.json(campgrounds);
};
