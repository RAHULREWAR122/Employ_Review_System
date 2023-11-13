const User = require('../models/user');


module.exports.signIn = async (req,res)=>{
       if(req.isAuthenticated()){
        return res.render('home');
       }
       
    return res.render('signIn');
}


 module.exports.signUp = async (req,res)=>{      
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }    
    return res.render('secretPage')
 }


module.exports.secretKey =(req, res)=>{

    const secretKey = 'Rahul';
    const userKey = req.body.secretKey;
   
    if (userKey === secretKey) {
        console.log("Success")
        return res.render('signUpPage');
         
    } else {

         req.flash('error' , "Invalid secret key. Try again.");
         return res.redirect('back');
    }
}


// creating User
module.exports.create =async (req,res)=>{

    // first we check password and conform password same or not
    if(req.body.password !== req.body.conform_password){
        console.log("Check your information again");
        return res.redirect('back');
    }
    // now check user email already exists or not
    User.findOne({ email : req.body.email , adminId : req.body.adminId} , (err , user)=>{
        if(err){
            console.log('Email or idNo use Already ,Try again something new');
            req.flash('error', 'Email or idNo use Already ,Try again something new')
            return res.redirect('back');
}
    //   if user not found then we create user
    if(!user){
        User.create({
            name : req.body.name,
            email : req.body.email,
            adminId : req.body.adminId,
            password : req.body.password,
            isAdmin : true
        
        } ,(err , user)=>{
            if(err){
                console.log('error in creating user' , err.message);
                req.flash('error', 'Employee Already Exist ,Try to sign-In')
                return res.redirect('/');
         }
               req.flash("success" , `Sign Up Successfully by : ${req.body.name}`);
                    return res.redirect('/');
        
    })
     }else{
        console.log('error in creating user' , err.message);
        return res.redirect('back');
     }
  })
}







module.exports.createSession = async (req,res)=>{
    let userName = req.user.name ;
    req.flash("success" , `Welcom MR/MS : ${userName}`);
    return res.redirect('back');
    
}
module.exports.forgetPasswordPage = function(req, res){
    return res.render('forgotPassword',{
        title : 'Recover Password'
    });
}



// this will update the existing password, with the newly created password.
module.exports.forgotPasswordRecover = async function(req, res){
   
    let user = await User.findOne({ $or: [
        { adminId: req.body.adminId },
        { email: req.body.email }
    ]
   });
    if(!user){
        console.log("Email id / ID No Is not avaliable")
        req.flash('error' ,"Email OR AdminId Not Matches")
        return res.redirect('back');
    }
   if(req.body.password !== req.body.conform_password){
    console.log('Password Not matches');
    req.flash('error' ,"Password Not Matches")
    return res.redirect('back');
   }

    if(req.body.password == req.body.conform_password){

        req.flash('success' ,"Password Reset Successfully")
        user.password = req.body.password;
        
        await user.updateOne({password : req.body.password});
        
        req.flash('success',"Now You SignIn With New Password")
        return res.redirect('/');
    
    }

       req.flash('error',"Error inReset Password")
       return res.redirect('back');
}



module.exports.signOut  = async (req, res)=>{

    req.logout((err)=>{
        if(err){
            console.log('Error in logout' ,err);
            return ;
        }
        req.flash('success',"LogOut Successfully");
        return res.redirect('/');
    })

}
 

module.exports.update =async (req , res)=>{
    try{
        if(req.isAuthenticated()){
            if(req.user.isAdmin){
                let admin = await User.find({});
                   
                if(admin){
                    const newUser = req.user;
                    return res.render('updateUser' , {
                    title : "Profile Update" ,    
                    user_update  : newUser
                   })
                }
        }else{
                console.log("user is not authorized checking list of Employees");
                return res.redirect('/');
            }
        }else{
            console.log("user not authenticated");
            return res.redirect("/");
        }
    }catch(err){
        console.log("Error", err);
        return;
    }
    
   

}


// update user profile
module.exports.updateUser =async (req,res)=>{
    // find by user id , if id is matches then update
        if(req.user.id === req.params.id){
            User.findByIdAndUpdate(req.params.id , req.body , (err , user)=>{
                if(err){
                   req.flash('error',"SomeOne already Use ID-NO Try other ID-NO")
                   return res.redirect('back');
                }    

                req.flash('success',`Profile Update Successfully by ${req.user.name}`)
                return res.redirect('back');
            })
        }else{
            req.flash('error',"Error in update")
            return res.redirect('back');
        }
      
    }



