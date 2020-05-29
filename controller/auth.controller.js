const Bluebird = require('bluebird')
const passport = require('passport')


signup = (req, res, next) => Bluebird.resolve()
    .then(async (err) => {
        const user = await authenticate(req, res, next)
        if(!user){
            return res.status(401).send('Invalid email or password')
        }
        await login(req, user)
        const temp = req.session.passport
        await regenerateSession(req)
        req.session.passport = temp
        await saveSession(req)

        return res.json()
    })
    .catch((err)=>{
        return res.status(401).send(err.message)
    })

signin = (req, res, next) => Bluebird.resolve()
    .then(async (err) => {
        const user = await authenticate(req, res, next)
        if(!user){
            return res.status(401).send('Invalid email or password')
        }
        await login(req, user)
        const temp = req.session.passport
        await regenerateSession(req)
        req.session.passport = temp
        await saveSession(req)

        return res.status(200).json({status: true, message: "Successfully signed in.", 
        session_id: req.sessionID, data: req.user})
    })
    .catch((err)=>{
        return res.status(401).send(err.message)
    })

signout = (req, res) => {
    req.logout()
    res.status(200).json({ status: true, message: "Successfully signed out.", auth_token: null })
}

/**
 * Authenticate with passport.
 * middleware invokes req.login() automatically. 
 * This function is primarily used when users sign up, during which req.login() can be invoked 
 * to automatically log in the newly registered user. 
 */
const authenticate = (req, res, next) => new Bluebird((resolve, reject) => {
    // this is a promise
    passport.authenticate('localAuth', (err, user, err_info) => {
        if(err || err_info){
            return reject(err || err_info)
        }
        return resolve(user)
    })(req,res,next)
})


/**
 * Login
 * @param {Object} req
 * @param {Object} user
 */
const login = (req, user)=> new Bluebird((resolve, reject)=> {
    req.login(user, (err)=> {
        if(err){
            return reject(err)
        }
        return resolve()
    })
})

/**
 * Regenerate user session.
 * @param {Object} req
 */

const regenerateSession = req => new Bluebird((resolve, reject)=> {
    req.session.regenerate((err)=>{
        if(err){
            return reject(err)
        }
        return resolve()
    })
})


/**
 * Save user session.
 * @param {Object} req
 */

const saveSession = req => new Bluebird((resolve, reject)=> {
    req.session.save((err)=>{
        if(err){
            return reject(err)
        }
        return resolve()
    })
})


/**
 * HTTP handler for sign in.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports = {
    sign_in: signin,
    sign_out: signout,
    sing_up: signup
}