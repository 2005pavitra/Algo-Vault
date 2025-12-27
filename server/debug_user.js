const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/algovault';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");
        const user = await User.findOne({ email: 'pavitrapandeysagar@gmail.com' });
        console.log("User Record:", user);
        if (!user) {
            console.log("User not found!");
        } else if (!user.username) {
            console.log("CRITICAL: User exists but has NO username!");
            // Fix it
            user.username = "pavitra_fixed";
            await user.save();
            console.log("Fixed user username to 'pavitra_fixed'");
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
