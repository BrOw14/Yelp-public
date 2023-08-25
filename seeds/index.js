const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const images = [
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334215/YelpCamp/h3olecvxeimaukvnbcv7.jpg",
		filename: "YelpCamp/h3olecvxeimaukvnbcv7",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334214/YelpCamp/wy2ksyo2ubbzxafirc5y.jpg",
		filename: "YelpCamp/wy2ksyo2ubbzxafirc5y",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334213/YelpCamp/npoqulzloejm3aewks7e.jpg",
		filename: "YelpCamp/npoqulzloejm3aewks7e",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334213/YelpCamp/q3t0le3r4kw7feqteejj.jpg",
		filename: "YelpCamp/q3t0le3r4kw7feqteejj",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334211/YelpCamp/ng1rnej4j3ovvr5oscyu.jpg",
		filename: "YelpCamp/ng1rnej4j3ovvr5oscyu",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334211/YelpCamp/phf70ytjsio64t9bsyfv.jpg",
		filename: "YelpCamp/phf70ytjsio64t9bsyfv",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334210/YelpCamp/yowqxklmd9uvowf5ozdk.jpg",
		filename: "YelpCamp/yowqxklmd9uvowf5ozdk",
	},
	{
		url: "https://res.cloudinary.com/dxce9qhat/image/upload/v1692334210/YelpCamp/miwejlxlutou2iimdsdy.jpg",
		filename: "YelpCamp/miwejlxlutou2iimdsdy",
	},
];

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 30; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const random7 = Math.floor(Math.random() * 7);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "64a445db09c196fb8d137927",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium repudiandae ab odio ea quia, iste tempore, voluptas autem expedita est voluptates ad illo accusamus aliquam ipsum incidunt temporibus porro blanditiis!",
			price,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			images: {
				url: `${images[random7].url}`,
				filename: `${images[random7].filename}`,
			},
		});
		await camp.save();
	}
};

seedDB().then(() => {
	db.close();
});
