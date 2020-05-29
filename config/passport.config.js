const Bluebird = require('bluebird')
const LocalStrategy = require('passport-local').Strategy
const userRepository = require('../repository/user.repository')

module.exports = (passport) => {
    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => Bluebird.resolve()
    .then(async () => {
        const  user = await userRepository.getById(id)
        done(null, user)
    }).catch(done))

    // get from api's header
    var strategyOptions = {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }
    
    verifyStrategy = (req, username, password, done) => Bluebird.resolve()
        .then(async () => {
            const user = await userRepository.getByEmail(username)
            
            if(!user){
                return done(null, null, {message: "Incorrect username."})
                // return done(null, null, {message: "Incorrect username."})
            }else{
                if(!await user.comparePassword(password)){
                    return done(null, null, {message: "Incorrect password."})
                }
                if(user.status != 'ACTIVE'){
                    return done(null, null, {message: "User status is not active, please contact admin."})
                }
            }
            return done(null, user)
        }).catch(done)

    // Local Auth
    passport.use('localAuth', new LocalStrategy(
        strategyOptions, 
        verifyStrategy
    ))
    
}