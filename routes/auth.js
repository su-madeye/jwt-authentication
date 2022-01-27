const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const { registerValidation, loginValidation } = require("../validation");
const JWT = require('jsonwebtoken');
// router.get('/register', (req, res) => {
//     res.send("inside regiser")
// });


router.post('/register', async (req, res) => {
    // res.send(req.body);
    console.log(req.body);

    const {error} = registerValidation(req.body);

    if(error)   return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    // return res.send(emailExist);
    if(emailExist) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10) 
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try{
        const savedUser = await user.save();
        res.status(200).send({user: savedUser._id});
    } catch(err) {
        res.status(400).send({status: "Failed", msg: err});
    }
});

router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error)   return res.status(400).status(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    // return res.send(emailExist);
    if(!user) return res.status(400).send('Email does not exists');

    // decrypt password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword)   return res.status(400).send("Invalid password");

    const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});


module.exports = router;