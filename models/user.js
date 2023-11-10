const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    email : {
        unique : true ,
        type : String ,
        required : true ,
    },
    adminId : {
        unique : true ,
        type : String ,
               
    },
    password : {
        type : String ,
        required : true ,
    },
    isAdmin : {
        type : Boolean ,
         
    },
    secret:{
        type :String ,
    },

      to : [    
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
        }
    ],
    from : [  
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review',
        }
    ]

} ,{
    timestamps : true ,
})


const User = mongoose.model('User' , userSchema);

module.exports = User ;