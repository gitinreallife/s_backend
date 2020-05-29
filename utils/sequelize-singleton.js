require('dotenv').config()
Sequelize = require('sequelize')
self = module.exports
let ISequelize


/**
 * Construct a singleton sequelize object to query the database
 * 
 * @returns {object} - Sequelize object
 */
exports.initialize = () => {
    if(!ISequelize){
        var dbName, dbUserName, dbPassword, dbHost, dbPort
        if(process.env.NODE_ENV == 'development'){
            dbName = process.env.DEV_DATABASE_NAME
            dbUserName = process.env.DEV_DATABASE_USERNAME
            dbPassword = process.env.DEV_DATABASE_PASSWORD
            dbHost = process.env.DEV_DATABASE_HOST
            dbPort = process.env.DEV_DATABASE_PORT
        }else if(process.env.NODE_ENV == 'production'){
            dbName = process.env.PROD_DATABASE_NAME
            dbUserName = process.env.PROD_DATABASE_USERNAME
            dbPassword = process.env.PROD_DATABASE_PASSWORD
            dbHost = process.env.PROD_DATABASE_HOST
            dbPort = process.env.PROD_DATABASE_PORT
        }
        var dialect = process.env.DIALECT
        sOption = {
            host: dbHost,
            // port: dbPort,
            dialect: dialect
        }
        return new Sequelize(dbName, dbUserName, dbPassword,sOption )

    }
    return ISequelize
}

module.exports = self.initialize()