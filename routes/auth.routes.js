function authRoute(app){
    const auth = require('../controller/auth.controller')
    // app.post('/signup', auth.sign_up)
    app.post('/api/signin', auth.sign_in)
    app.post('/api/signout', auth.sign_out)

}

// app.post('/sign-in', require('./routes/sign-in'));
// app.post('/sign-out', require('./routes/sign-out'));
module.exports = authRoute