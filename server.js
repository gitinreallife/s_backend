const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser = require('body-parser')

const passportConfig = require('./config/passport.config')
const ISequelize = require('./utils/sequelize-singleton')

require('./model/user.model')
require('./model/session.model')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


passportConfig(passport)
app.use(session({
    secret: process.env.DEV_SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    store: new SequelizeStore({
        db: ISequelize,
        table: 'Session'
    })
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

app.get("/", (req, res) => {
    res.send('You hit home')
  });

//force: true will drop the table if it already exists
// ISequelize.sync({force:true}).then(()=>{
//     console.log('Drop and Resync with { force: true }')
// })

require('./routes/user.routes')(app)
require('./routes/auth.routes')(app)

// app.post('/sign-in', require('./routes/sign-in'));
// app.post('/sign-out', require('./routes/sign-out'));

var host = process.env.DEV_DATABASE_HOST
var port = process.env.DEV_DATABASE_PORT

const cors = require('cors')
const corsOption = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200
}
app.use(cors(corsOption))

// Create a server
var server = app.listen(port, function(){

    console.log(`App listening at http://${host}:${port}`)
})