const Sequelize = require('sequelize')
const ISequelize = require('../utils/sequelize-singleton')


/**
 * Sessions table is used to store user session persistently.
 * 
 *
 * Read more on https://www.npmjs.com/package/connect-session-sequelize
 */

const sessionSchema = {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    expires: Sequelize.DATE,
    expires_int: Sequelize.INTEGER,
    data: Sequelize.STRING(50000)
}
const options = {
    indexes: [{
        name: 'session_sid_index',
        method: 'BTREE',
        fields: ['sid'],
    }]
}

const Session = ISequelize.define('Session', sessionSchema, options)

exports.schema = () => sessionSchema
exports.model = () => Session