const User = require('../models/user');

// View Eployees and admin both 
module.exports.viewEmployees = async function(req, res){
    try{
        // first check user is authenticated or not 
        if(req.isAuthenticated()){
            if(req.user.isAdmin){
                // now check user is admin or not because authenticated employee and admin both are  here present so we want that only admin reach hre .   let employees = await User.find({});
                let employees = await User.find({});
                if(employees){
                    return res.render('viewEmployees', {
                        title : "Employees",
                        employees : employees,
                    });
                }
            }else{

                console.log("user is not authorized for checking list of Employees");
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
};


//  add Employees Get Request (Reach page) 
module.exports.addEmployee = async (req,res)=>{    
    try{
        // first check user is authenticated or not 
        if(req.isAuthenticated()){
          // now check user is admin or not because authenticated employee and admin both are  here present so we want that only admin reach hre .   let employees = await User.find({});
             if(req.user.isAdmin){
                let admin = await User.find({});
                   if(admin){
                    return res.render('addEmployee', {
                        title : "Add Employees",
                    });
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


// Add New Employees with Action of post Request
module.exports.addEmployees = async (req,res)=>{
    // check password and conform password is same or not 
    if(req.body.password !== req.body.conform_password){
       req.flash('error' , "Password Dosen't Matches")
       return res.redirect('back');

    }
    //  find user with email and Id No both because both are same we give Id No because if admin make any employee to admin then need for ID No becasue its unique for all adminers
     User.findOne({email : req.body.email , adminId : req.body.adminId } , (err , user)=>{
       if(err){
           req.flash('error' , "Error in finding User")
           return res.redirect('back');
   
       }
    
       if(!user){
    // if user not found  then create 
      
        User.create({
           name : req.body.name,
           email : req.body.email,
           password : req.body.password,
           adminId : req.body.adminId,
    //   here we put isAdmin false because when admin create employee then that time he/she  not admin 
           isAdmin : false
          
       })
      
        req.flash('success' , `Employee ${req.body.name} Created Successfully`)
       return res.redirect('/admin/viewEmployees');

       }else{
        
        return res.redirect('back');

       }
     })
}



// only admin delete Employees and Other Admins
module.exports.deleteEmployee = async function(req, res){
    try {
        
    // check password and conform password is same or not
        if (req.isAuthenticated()) {
    
            //  find user with email and Id No both because both are same we give Id No because if admin make any employee to admin then need for ID No becasue its unique for all adminers
            if (req.user.isAdmin) {
    
                //   fetch employee Id if user try to delete self then he/she can't it  
                const employeeId = req.params.id;
                  if (employeeId === req.user._id.toString()) {
                     req.flash('error' , `${req.user.name} You can't delete Yourself`)
                     return res.redirect('back');
                }
                 
                // if try to delete other user then do
                await User.deleteOne({ _id: employeeId });
                
                req.flash('success' , `Employee deleted successfully`)
                return res.redirect('back');
            } else {
                return res.redirect('back');
            }
        } else {
            // If the user is not authenticated, redirect to the home page .
            return res.redirect("/");
        }
    } catch (err) {
        console.log("Error", err);
        return res.redirect('back');
    }
};


//  make admin for any employees
module.exports.newAdmin = async function(req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }
        // Check if the authenticated user is an admin
        if (req.user.isAdmin !== true) {
            return res.redirect('/');
        }

        let employee = await User.findById(req.body.newAdmin);
         
        if (!employee) {
            return res.redirect('back');
        }

        // if Admin try to change self then not change self category Admin or Employee 
        if (req.user._id.equals(employee._id)) {
            req.flash('error' , `${req.user.name} You Can't decide Yourself`)
            return res.redirect('back');
        }

        // Check if the selected employee is already an admin
        if (employee.isAdmin === true) {
            req.flash('error' , `${employee.name} is already Admin`)
            return res.redirect('back');
        }


        // Make the employee an admin
        employee.isAdmin = true;
       
        await employee.save();
       
        req.flash('success' , "Employee Successfully Converted to Admin");
        return res.redirect('back');
    
    } catch (err) {
        console.log("Error", err);
        return res.redirect('/home');
    }
};

// make any admin to Employee by other admin
module.exports.newEmployee = async function(req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }
        
        // Check if the authenticated user is an admin
        if (req.user.isAdmin !== true) {
            return res.redirect('/');
        }

        let employee = await User.findById(req.body.demoteAdmin);
        
        if (!employee) {
            return res.redirect('back');
        }

         // if Admin try to self change then not change self category Admin or Employee 
         if (req.user._id.equals(employee._id)) {
              req.flash('error' , `${req.user.name} You Can't decide YourSelf`)
              return res.redirect('back');
        }
        
        // Check if the selected employee is not already a regular employee
        if (employee.isAdmin === false) {
            req.flash('error' , `${employee.name} is already Employee`)
         
            return res.redirect('back');
        }


        // Demote the admin to a regular employee
        employee.isAdmin = false;
        req.flash('success' , "Admin Successfully Converted to Employee")
        await employee.save();

        return res.redirect('back');
    } catch (err) {
        console.log("Error", err);
        return res.redirect('/home');
    }
};




// get req for admin page for sending/Selecting Recipients and Reviewer 
module.exports.adminPage = async function(req, res){
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }else{
        // check user is admin or not
        if(req.user.isAdmin == false){
            return res.redirect('/');
        }else{
            try{
                let user = await User.find({});
                var employeeList = [];
                for(let i = 0; i < user.length; i++){
                    var temp = {
                        name : user[i].name,
                        id : user[i].id,
                    };
                    employeeList.push(temp);
                }
                if(req.isAuthenticated()){
                if(req.user.isAdmin){
                    return res.render('adminPage',{
                    title : "Admin Page",
                    employeeList : employeeList,
                });
            }
        }else{
            return res.redirect('/');
        }
            }catch(err){
                console.log('Error while admin', err);
                return;
            }
        }
    }
};


// set review for employee
module.exports.setReviewrs = async function(req, res){
    try{
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        } else {
            let employee = await User.findById(req.user.id);

            if (req.body.Reviewer == req.body.Recipient) {
                return res.redirect('back');
            } else {
                let reviewer = await User.findById(req.body.Reviewer);
                
                // if reviewer not found
                if(!reviewer){
                    return res.redirect('back');
                }

                let recipient = await User.findById(req.body.Recipient);

                if(!recipient){
                    return res.redirect('back');
                }

                if(!reviewer.to.includes(recipient)) {
                    reviewer.to.push(recipient);
                    reviewer.save();
    
                    recipient.from.push(reviewer);
                    recipient.save();
                }

                return res.redirect('back');
            }
        }
    }catch(err){
        console.log("Error", err.message);
        return;
    }
    
};

