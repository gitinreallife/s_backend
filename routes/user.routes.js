function userRoute(app){
    const users = require('../controller/user.controller.js')

    // Create a new user
    app.post('/api/user', users.create)

    //retrieve all users
    app.get('/api/users', users.findAll)

    //retrieve all users by status
    app.get('/api/users/:status', users.findListByStatus)

    //retrieve a single user
    app.get('/api/user/:id', users.findById)

    // app.get('/api/user/filter', users.filter)

    //retrieve a single user by email
    app.get('/api/user/:email', users.findByEmail)

    //retrieve a single user by mobile phone
    app.get('/api/user/:mobile_phone', users.findByMobilePhone)

    //update user
    app.put('/api/user/:id', users.update)

    //delete user
    app.delete('/api/user/:id', users.delete)
}

module.exports = userRoute