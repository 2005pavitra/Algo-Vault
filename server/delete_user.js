const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/algovault';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");
        await User.deleteOne({ email: 'pavitrapandeysagar@gmail.com' });
        console.log("Deleted user pavitrapandeysagar@gmail.com");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
