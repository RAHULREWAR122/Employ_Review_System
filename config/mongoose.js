const mongoose = require('mongoose');
// connect with database
mongoose.connect('mongodb://127.0.0.1/test_',{ useNewUrlParser: true, useUnifiedTopology: true });

const db =  mongoose.connection;
// if in connect any error
db.on('error' , console.error.bind('error inconnect db'));

// if connection success
db.once('open' ,()=>{
    console.log("mongoDB connected Successfully");

})

module.exports = db;

