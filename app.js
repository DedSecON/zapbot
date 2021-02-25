const express = require('express')
const path = require('path')
const mysql = require('mysql')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const logger = require('./log/index.js')
const pinoHttp = require('pino-http')({
   logger,
   // serializers: {
   //    req(req) {
   //      req.body = req.raw.body;
   //      return req;
   //    },
   //  },

})

const app = express();



dotenv.config({path: './.env'})




var hbs = require('hbs');

const db = mysql.createConnection({
   host: process.env.DATATABASE_HOST,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASS,
   database: process.env.DATABASE,
   charset : 'utf8mb4'

})



const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))


app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())

app.use(pinoHttp)



app.set('view engine', 'hbs')

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('ifeq', function (a, b, options) {
   if (a == b) { return options.fn(this); }
   return options.inverse(this);
});

hbs.registerHelper('breaklines', function(text) {
   text = hbs.Utils.escapeExpression(text);
   text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
   return new hbs.SafeString(text);
});



hbs.registerHelper('ifnoteq', function (a, b, options) {
   if (a != b) { return options.fn(this); }
   return options.inverse(this);
});   

db.connect((error) =>{
   if (error){
      //console.log(error)
      logger.error(error);
   }else{
      //console.log("MySQL connected!")
      logger.info("MySQL connected!")
   }
})

app.use(function (req, res, next) {
   switch (req.path) {
       case '/':
           res.locals.title = 'index';
           
           break;
       case '/login':
           res.locals.title = 'login';
           break;
       case '/campanhas':
           res.locals.title = 'campanhas';
           break;
       case '/contatos':
           res.locals.title = 'contatos';
           break;
       default:
         //console.log("oi3")
         res.locals.title = 'No Meta Tag';
   }
   next();
});

//Rotas 
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

process.on('uncaughtException', function (exception) {
   logger.error(exception); 
 });



// app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//  });

//  // Error handler
//  app.use(function(err, req, res, next) {
//    // Set locals, only providing error in development
//    res.locals.message = err.message;
//    res.locals.error = req.app.get('env') === 'development' ? err : {};

//    // Render the error page
//    res.status(err.status || 500);
//    res.render('error');
//  });

const porta = 80;
app.listen(porta, () => {
   logger.info("Startou porta "+porta);
})
