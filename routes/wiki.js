const express = require("express");
const router = express.Router();

router.get("/", function(req,res) {
    res.send("Wiki home page")
});

router.get("/about", function(req,res){
   res.render("wiki-about", {
       message: "About this Wiki",
    });
});

router.get('/users/:userId', (req,res) => {
    res.send(req.params);
})

module.exports = router;