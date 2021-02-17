const mongoose = require("mongoose");
const express = require("express");
const exphbs = require("express-handlebars");
const path =require("path");
const favicon = require("serve-favicon");

const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

const initializePassport = require("./passport_config");
const flash = require("connect-flash");
const mongoSanitize = require('express-mongo-sanitize');



const Router = require("./routes");


const  app = express();

require('dotenv').config()

const handlebars =exphbs.create({
    extname:"hbs",
    defaultLayout:"main",
    layoutsDir:path.join(__dirname,"views","layouts"),
    partialsDir:path.join(__dirname,"views","partials")
});




mongoose.connect("mongodb://localhost/siteMapping", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() =>{
    console.log("Mongo DB Connected");

}).catch(error =>{
    console.log(error);
    console.log("Mongo DB connection Error")
})



if (process.env.NODE_ENV === "development"){
    app.use(require("morgan")("tiny"));
}
app.use(express.static(path.join(__dirname,"public")))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(mongoSanitize())

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

app.use(flash());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: 'strict' },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(Router);

let PORT = process.env.PORT||5600;

let HOST = process.env.PROD_HOST;
if (process.env.NODE_ENV === "development"){
    HOST = process.env.TEST_HOST;
}

app.listen(PORT,() =>{
    console.log(`Server running in ${process.env.NODE_ENV} on url : http://${HOST}:${PORT}`)
} )
