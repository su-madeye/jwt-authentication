const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
require("dotenv/config");

mongoose.connect(
    process.env.DB_CONNECTION,
    () => console.log('connected to db')
);

const userRoute = require('./routes/auth')
const postRoute = require('./routes/post')

app.use('/api/users/', userRoute);
app.use('/api/post/', postRoute);


app.get('/', (req, res) => {
    res.send('works');
});

app.listen(3000, () => console.log("running"))