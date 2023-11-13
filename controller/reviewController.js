const User = require('../models/user');
const Review = require('../models/review');


module.exports.goReview =async (req,res)=>{
    try {
        // if user is not looged in then send back to login
        if(!req.isAuthenticated()){
            return res.redirect('/');
        
    }

        let user = await User.findById(req.user.id);
        let review = await Review.find({to : req.user.id});
        // findOne({  });

        let recipients = [];

        for(let i = 0; i < user.to.length; i++){
            let x = await User.findById(user.to[i]);
            
            if(!recipients.includes(x)) recipients.push(x);
        }

        // find reviews
        let reviews = [];

        for(let i = 0; i < review.length; i++){
            let j = await User.findById(review[i].from);
            

            let curr_review = {
                name : j.name,
                review : review[i].review,
                updated : review[i].updatedAt,
            };

            req.flash('success' ,'Review Pushed Successfully');
            reviews.push(curr_review);
        }
        return res.render('seeReview', {
            title : "reviews",
            recipients: recipients,
            reviews: reviews,
            user : user,
            
 })
    
    }catch(error) {
        console.log(error);
        return;



    }

}



module.exports.createReview = async function(req, res){
    try{
        let recipient = await User.findById(req.params.id);

        if(!recipient) return res.redirect('/home');

        for(let i = 0; i < recipient.from.length; i++){
            if(req.user){
                if(recipient.from[i] == req.user.id){
                    const new_review = Review.create({
                        to : recipient.id,
                        from : req.user.id,
                        review : req.query.newReview,
                    });
                    req.flash('success' , "Review Created Successfully")
                    return res.redirect('back');
                  }
            }else{
                req.flash('error' , "Error in Creating Review")
                return res.redirect("back");
            }
        }
        return res.redirect('/home');
    }catch(err){
        console.log("Error", err);
        return;
    }

};

