const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const {body, validationResult} = require("express-validator");

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
	Genre.find({}, function (err, list_genres) {
		if (err) {
			return next(err)
		}
		res.render("genre_list", {
			title: "Genre List",
			genre_list: list_genres
		});
	})
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
	async.parallel({
			genre(callback) {
				// Grabbing the id from the request parameter
				Genre.findById(req.params.id).exec(callback);
			},
			genre_books(callback) {
				Book.find({genre: req.params.id}).exec(callback);
			},
		},
		(err, results) => {
			console.log(results)
			if (err) {
				return next(err);
			}
			if (results.genre == null) {
				// No results.
				const err = new Error("Genre not found");
				err.status = 404;
				return next(err);
			}
			// Successful, render.
			res.render("genre_detail", {
				title: "Genre Detail",
				genre: results.genre,
				genre_books: results.genre_books,
			});
		}
	)
};

// Display Genre create form on GET
exports.genre_create_get = (req, res, next) => {
	res.render("genre_form", {title: "Create Genre"});
};

// Handle Genre create on POST.
exports.genre_create_post = [
	// Validate and sanitize the name field.
	body("name", "Genre name required").trim().isLength({min: 1}).escape(),

	// Process request after validation.
	(req, res, next) => {
		// Get the validation errors from the request.
		const errors = validationResult(req);

		// Create a genre object with escaped and trimmed data.
		const genre = new Genre({name: req.body.name});

		if (!errors.isEmpty()) {
			// Errors, render the form again with sanitized values and error messages.
			res.render("genre_form", {
				title: "Create Genre",
				genre,
				errors: errors.array(),
			});
			return;
		} else {
			// Data is valid, check if Genre already exists.
			Genre.findOne({name: req.body.name}).exec((err, found_genre) => {
				if (err) {
					return next(err);
				}
				if (found_genre) {
					res.redirect(found_genre.url);
				} else {
					genre.save((err) => {
						if (err) {
							return next(err);
						}
						res.redirect(genre.url);
					});
				}
			});
		}
	},
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Genre update POST");
};