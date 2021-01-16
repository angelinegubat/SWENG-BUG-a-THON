const express = require('express');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const mongoose = require("mongoose");
const router = express.Router();
const MongoStore = require('connect-mongo')(session);
const db = require('./models/db.js');
require('dotenv/config');

// Creates the express application
const app = express();
//const port = 9090;

/**
  Creates an engine called "hbs" using the express-handlebars package.
**/
app.engine( 'hbs', exphbs({
  extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
  defaultView: 'main', // this is the default value but you may change it to whatever you'd like
  layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
  partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
  // Additional helpers declared to reformat text prior to rendering
  helpers: {
    cap: function(text) { return text.toUpperCase(); },
    em: function(text) {
      var x = `<em>${text}</em>`;
      /**
        handlebars and express-handlebars are 2 different packages.
        express-handlebars basically is a wrapper to make it shorter to write handlebars code
        in express apps.

        the SafeString function is not available in express-handlebars so we need to install
        and use the main handlebars package to access the function.
      **/
      return new handlebars.SafeString(x);
    },
    status: function(value) {
    	//var text;
    	if(value) {
    		value = "Currently Active"
    	}
    	else {
    		value = "Inactive/Left"
    	}
    	return value;
    }
  }
}));

// Setting the view engine to the express-handlebars engine we created
app.set('view engine', 'hbs');

const url = 'mongodb+srv://123:123@restaurantdb.wjxkv.mongodb.net/restaurant?retryWrites=true&w=majority';
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

db.connect(url, options, err => {
    if (err) throw err;
    console.log('connected at ' + url);
});

app.use(session({
  'secret': 'notreally',
  'resave': false,
  'saveUninitialized': false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(require('body-parser').urlencoded({extended:false}));
//Route importing
const routes = require('./routes/routes.js');


app.use('/', routes);



app.use(express.static('public'));

// Listening to the port provided
let port = process.env.PORT;

if(port == null || port == "") {
    port = 9090;
}
app.listen(port, function () {
  console.log('app listening at port ' + port);
});

module.exports = router ;