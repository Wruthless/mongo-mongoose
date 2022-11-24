var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

/**
 * Cool router without a view.
 */
// router.get('/cool', function(req, res, next) {
//     res.send('You\'re so cool.');
// });

/**
 * Cool router with a view.
 */
router.get("/cool", (req, res, next) => {
    res.render("cool", {
        message: "You're so cool.",
    });
});
module.exports = router;
