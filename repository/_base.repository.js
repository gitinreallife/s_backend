// Repository is for query helpers, middleware that handles data collecting and transaction

var instance, Model, Schema

Base = (param) =>{
    modelName = param
    if(param != ''){
        instance = require(`../model/${param}.model`)
        Model = instance.model()
        Schema = instance.schema()
    }
    return {
        Model: Model,
        getById: findById
        , getByEmail: findByEmail
        , getList: findAll
        , create: create
    }
}
module.exports = Base

create = (obj) => {
    return Model.create(obj).then(result=> {
        res.send(result)
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Some error occurred while creating Model."
        })
    })
}


findById = (id) => {
    return Model.findOne({
        where: {id: id}
    })
    // how to handle error
    // .then(object => {
    //     return object
    // }).catch(err => {
    //     return {error: err}
    // })
}

//FETCH by email
findByEmail = (email) => {
    return Model.findOne({
        where: { email: email}
    })
}

// FETCH all objects or filter
findAll = (filters) => {
    Model.findAll(filters)
}