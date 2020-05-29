const ISequelize = require('../utils/sequelize-singleton')
const Bluebird = require('bluebird')
const Op = require('sequelize').Op
const _ = require('lodash')
var Model, modelName

function create(req, res, next) {
    obj = {}
    console.log('=================')
    console.log(req.body)

    //save to MySQL database
    for(key in req.body){
        obj[`${key}`] = req.body[`${key}`]
    }
    Model.create(obj).then(result=> {
        // send created result to client
        res.send(result)
    }).catch(err=>{
        res.status(500).send({
            message: err.message || "Some error occurred while creating Model."
        })
    })
}

//FETCH by ID
findById = (req, res, next) => {
    Model.findOne({where: {id: req.params.id}}).then(object => {
        res.send(object)
    }).catch(err => {
        res.status(500).send({
            message: "Error retrieving object with id = " + req.params.id
          })
    })
}

// FETCH all objects or filter
findAll = (req, res, next) => {
    
    console.log('==findall=============================')
//     Ngo_V-v234kt9DNXEksmNxe-QNzOxWid
// { user: 'd9bb332d-bb7d-4d08-be88-8b6ec0ed92da' }
    console.log(req.sessionID)
    console.log(_.isEmpty(req.session.passport) )
    console.log(req.user)
    console.log('===============================')
    // conditions haven't been tested yet
    var conditions = {}
    for(var param in req.query){
        if (req.query.hasOwnProperty(param) && req.query[param] != '' ) {
            conditions[param] = {
                [Op.like]: `%${req.query[param]}%`
            }
        }
    }
    var filters = Object.keys(conditions).length > 0 ? {where: conditions} : {}

    Model.findAll(filters).then(objects => {
        //send all objects to the client    
        // console.log('------------------')
        // console.log(objects)
        res.send(objects)
    }).catch(err => {
        console.log('---errorsss---------------')
        console.log(err)
         res.status(500).send({
            message: err.message || "Some error occurred."
        })
    })
}


update = (req, res, next) => {
    var obj = req.body
    const id = req.params.id
    Model.update( obj, { where: {id: id} 
    }).then(() => {
        res.status(200).send(obj)
    }).catch(err => {
         res.status(500).send({
            message: err.message || `Some error occurred while updating ${modelName} with id = `+ id
        })
    })
}

deleteFunction = (req, res) => {
    const id = req.params.id
    Model.update({
        status: 'DELETED',
        updated_at: new Date()
    }, {
       where: {id: req.params.id} 
    }).then(() => {
        res.status(200).send("Deleted successfully")
    }).catch(err => {
         res.status(500).send({
            message: err.message || "Some error occurred."
        })
    })
}

Base = (param) =>{
    modelName = param
    if(param != ''){
        instance = require(`../model/${param}.model`)
        Model = instance.model()
    }
    return {
        db: ISequelize,
        Op: Op,
        Model: Model,
        create: create,
        update: update,
        delete: deleteFunction,
        findAll: findAll,
        findById: findById
    }
}
module.exports = Base