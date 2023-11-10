const express = require('express');
const cookieParser = require('cookie-parser');
const port = process.env.PORT;


const app = express();
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local');

const expressLayouts = require('express-ejs-layouts')

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');


const MongoStore = require('connect-mongo')(session);


app.set('view engine' ,'ejs')
app.set('views' , './views')


app.use(express.static('./assets'));


// app.use(express.static('./assets'));
app.set('layout extractStyles' , true)
app.set('layout extractScripts' , true)


app.use(session({
   name: 'ERS',
   secret: 'RR',
   saveUninitialized: false,
   resave: false,
   cookie: {
       maxAge: 1000 * 60 * 100
   },
   store: new MongoStore({
       mongooseConnection: db,
       autoRemove: 'disabled'
   }, function(err){
       console.log(err || 'connect-mongodb');
   }),
   

}));


app.use(express.urlencoded());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(expressLayouts);



app.use(flash());
app.use(customMiddleware.setFlash);





app.use('/' , require('./routes'))


app.listen(port , (err)=>{
         if(err){
            console.log('Error in runing server',err);
         }
         console.log('Server running successfully on port no :' , port);
})
