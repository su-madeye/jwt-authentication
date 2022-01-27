const router = require('express').Router();
const verify = require('./verify')
router.get('/', verify, (req, res) => {
    res.json({
        post: {
            title: "TITLE",
            description: "DES"
        }
    });
});

module.exports = router;
