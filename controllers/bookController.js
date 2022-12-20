const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const {body, validationResult} = require('express-validator');

const async = require("async");

// TESTING
exports.book_count = function (req, res, next) {
	Book.find({}, function (err, results) {
		console.log(err);
		res.send(results);
	})
}

//-----------------------------------------------------------


// TESTING
exports.book_list_test = function (req, res, next) {
	Book.find({}, function (err, results) {
		console.log(err)
		res.render("book-list", {
			title: "Book List",     // title is populated in layout.jade
			results: results
		});
	});
}

//-----------------------------------------------------------

// TESTING
exports.book_list_pop = (req, res, next) => {
	Book.find({})
		.populate("author")
		.exec(function (err, list_books) {
			if (err) {
				return next(err);
			}
			res.render("book-list", {
				title: "Book List w/Author",
				results: list_books
			})
		})
}


//-----------------------------------------------------------

exports.index = (req, res, next) => {
	async.parallel(
		{
			book_count(callback) {
				Book.countDocuments({}, callback);
			},
			book_instance_count(callback) {
				BookInstance.countDocuments({}, callback);
			},
			book_instance_available_count(callback) {
				BookInstance.countDocuments({status: "Available"}, callback);
			},
			author_count(callback) {
				Author.countDocuments({}, callback)
			},
			genre_count(callback) {
				Genre.countDocuments({}, callback);
			},
		},
		(err, results) => {
			res.render("index", {
				title: "Library Home",
				error: err,
				data: results,
			});
		}
	)
};

// Display list of all books.
exports.book_list = (req, res, next) => {
	Book.find({}, "title author")
		.sort({title: 1})
		.populate("author")
		.exec(function (err, list_book) {
			if (err) {
				return next(err)
			}
			res.render("book_list", {
				title: "Book List",
				book_list: list_book
			});
		});
};


exports.book_detail = (req, res, next) => {
	async.parallel({
			book(callback) {
				Book.findById(req.params.id)
					.populate("author")
					.populate("genre")
					.exec(callback)
			},
			book_instance(callback) {
				BookInstance.find({book: req.params.id}).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err)
			}
			if (results.book == null) {
				const err = new Error("Book not found");
				err.status = 404;
				return next(err);
			}
			console.log(results);
			res.render("book_detail", {
				title: results.book.title,
				book: results.book,
				book_instances: results.book_instance,
			})
		}
	)
};

// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
	async.parallel({
			authors(callback) {
				Author.find(callback);
			},
			genres(callback) {
				Genre.find(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			res.render("book_form", {
				title: "Create Book",
				authors: results.authors,
				genres: results.genres
			})
		}
	)
};

// Handle book create on POST.
exports.book_create_post = [
	(req, res, next) => {
		// Convert genre to array for sanitization -- the form returns an array of `Genre` items (while for other
		// fields it returns a string). In order to validate the information we first convert the request to an
		// array, which is required for the next step.
		if (!Array.isArray(req.body.genre)) {
			req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
		}
		next();
	},
	body("title", "Title must not be empty.")
		.trim()
		.isLength({min: 1})
		.escape(),
	body("author", "Author must not be empty.")
		.trim()
		.isLength({min: 1})
		.escape(),
	body("summary", "Summary must not be empty.")
		.trim()
		.isLength({min: 1})
		.escape(),
	body("isbn", "ISBN must not be empty").trim().isLength({min: 1}).escape(),
	body("genre.*").escape(),

	// Process post validation.
	(req, res, next) => {
		const errors = validationResult(req);

		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre,
		});

		if (!errors.isEmpty()) {
			// Get all authors and genres for form.
			async.parallel({
					authors(callback) {
						Author.find(callback);
					},
					genres(callback) {
						Genre.find(callback)
					},
				},
				(err, results) => {
					if(err) {
						return next(err);
					}

					// Mark selected genre as checked.
					for(const genre of results.genre) {
						if (book.genre.includes(genre.id)) {
							// Current genre is selected. Set "checked" flag.
							genre.checked = "true";
						}
					}
					res.render("book_form", {
						title: "Create Book",
						authors: results.authors,
						genres: results.genres,
						book,
						errors: errors.array(),
					});
				}
			);
			return;
		}
		// Date is valid, save the new book.
		book.save((err) => {
			if(err) {
				return next(err);
			}
			// Redirect to new book record.
			res.redirect(book.url);
		});
	},
];

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Book update POST");
};