const Author = require("../models/author");
const Book = require("../models/book");
const async = require('async');
const {validationResult, body} = require("express-validator");

// Display list of all Authors.
exports.author_list = (req, res, next) => {
	Author.find()
		.sort([["family_name", "ascending"]])
		.exec(function (err, list_authors) {
			if (err) {
				return next(err);
			}
			res.render("author_list", {
				title: "Author List",
				author_list: list_authors,
			});
		})
};

// Display detail page for a specific Author.
exports.author_detail = (req, res, next) => {
	async.parallel({
			author(callback) {
				Author.findById(req.params.id).exec(callback)
			},
			authors_books(callback) {
				Book.find({
					author: req.params.id
				}, "title summary").exec(callback);
			},
		},
		(err, results) => {
			console.log(results)
			if (err) {
				return next(err);
			}
			if (results.author == null) {
				const err = new Error("Author not found");
				err.status = 404;
				return next(err);
			}
			console.log(results)
			res.render("author_detail", {
				title: "Author Detail",
				author: results.author,
				author_books: results.authors_books,
			});
		}
	)
};

// Display Author create form on GET.
exports.author_create_get = (req, res) => {
	res.render("author_form", {title: "Create Author"})
};

// Handle Author create on POST.
// Handle Author create on POST.
exports.author_create_post = [
	// Validate and sanitize fields.
	body("first_name")
		.trim()
		.isLength({min: 1})
		.escape()
		.withMessage("First name must be specified.")
		.isAlphanumeric()
		.withMessage("First name has non-alphanumeric characters."),
	body("family_name")
		.trim()
		.isLength({min: 1})
		.escape()
		.withMessage("Family name must be specified.")
		.isAlphanumeric()
		.withMessage("Family name has non-alphanumeric characters."),
	body("date_of_birth", "Invalid date of birth")
		.optional({checkFalsy: true})
		.isISO8601()
		.toDate(),
	body("date_of_death", "Invalid date of death")
		.optional({checkFalsy: true})
		.isISO8601()
		.toDate(),
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render("author_form", {
				title: "Create Author",
				author: req.body,
				errors: errors.array(),
			});
			return;
		}

		const author = new Author({
			first_name: req.body.first_name,
			family_name: req.body.family_name,
			date_of_birth: req.body.date_of_birth,
			date_of_death: req.body.date_of_death,
		});

		Author.findOne({
				first_name: req.body.first_name,
				family_name: req.body.family_name
			})
			.exec((err, found_author) => {
				if (err) {
					return next(err);
				}
				if (found_author) {
					res.redirect(found_author.url);
				} else {
					author.save((err) => {
						if (err) {
							return next(err);
						}
						res.redirect(author.url);
					});

				}
			})
	},
];


// Display Author delete form on GET.
exports.author_delete_get = (req, res, next) => {
	async.parallel({
			author(callback) {
				Author.findById(req.params.id).exec(callback);
			},
			authors_books(callback) {
				Book.find({author: req.params.id}).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.author == null) {
				// No results.
				res.redirect("/catalog/authors");
			}
			console.log(results.authors_books)
			res.render("author_delete", {
				title: "Delete Author",
				author: results.author,
				author_books: results.authors_books,
			});
		}
	);
};

// Handle Author delete on POST.
exports.author_delete_post = (req, res, next) => {
	async.parallel({
			author(callback) {
				Author.findById(req.body.authorid).exec(callback);
			},
			authors_books(callback) {
				Book.find({author: req.body.authorid}).exec(callback);
			},
		},
		(err, results) => {
			if(err) {
				return next(err);
			}
			if(results.authors_books.length > 0) {
				// Author has books. Render like GET.
				res.render("author_delete", {
					title: "Delete Author",
					author: results.author,
					author_books: results.author_books
				});
				return;
			}
			// Author has no book. Delete object and redirect to author list.
			Author.findByIdAndRemove(req.body.authorid,(err) => {
				if(err) {
					return next(err);
				}
				// Success
				res.redirect("/catalog/authors");
			})
		}
	)
};

// Display Author update form on GET.
exports.author_update_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Author update POST");
};