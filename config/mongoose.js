const mongoose = require('mongoose');
// connect with database
mongoose.connect(process.env.DB,{ useNewUrlParser: true, useUnifiedTopology: true });

console.log(process.env.DB)
const db =  mongoose.connection;
// if in connect any error
db.on('error' , console.error.bind('error inconnect db'));

// if connection success
db.once('open' ,()=>{
    console.log("mongoDB connected Successfully");

})

module.exports = db;

