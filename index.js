const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.listen(process.env.PORT || 1234, () => {
    console.log(`App is listening on port: ${process.env.PORT}`);
});
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Mongoose connected successfully');
});
// const cors = require('cors');
// app.use(cors());
const userRoutes = require('./routes/user-routes');
app.use('/api/user', userRoutes);
const postRoutes = require('./routes/post-routes');
app.use('/api/post', postRoutes);