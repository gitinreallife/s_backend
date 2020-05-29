const _ = require('lodash')
const bcrypt = require('bcrypt')
const Bluebird = require('bluebird')
const Sequelize = require('sequelize')
const ISequelize = require('../utils/sequelize-singleton')

const userSchema = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobile_phone:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Mobile phone already in use, please use another one.'
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: {
            args: true,
            msg: 'Email address already in use, please use another one.'
        }
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    address: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'ACTIVE',
        validate:{
            isIn: {
                args: [['ACTIVE', 'INACTIVE', 'DELETED']],
                msg: 'Status is not in Activation Status List.'
            }
        }
    }
}
const userOptions = {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    indexes: [
        {
          name: 'user_id_index',
          method: 'BTREE',
          fields: ['id'],
        },
        {
          name: 'user_email_index',
          method: 'BTREE',
          fields: ['email'],
        },
        {
          name: 'user_status_index',
          method: 'BTREE',
          fields: ['status'],
        },
      ],
    deletedAt: 'deleted_at'
}
const User = ISequelize.define('User', userSchema, userOptions)

User.prototype.comparePassword = function(pass){
    return Bluebird.resolve()
        .then(()=> bcrypt.compareSync(pass, this.password))
        .catch((err) => {
            console.log('-----Error Compare----------')
            console.log(err)
            return false
        })
}
User.beforeSave(async (user, options) => {
    user.name = _.trim(user.name)
    user.email = _.trim(user.email)
    user.mobile_phone = _.trim(user.mobile_phone)
    
    if((user.previous('password') !== user.password) && (!_.isEmpty(user.password))){
        // const salt = bcrypt.genSaltSync(10)
        // const hash = bcrypt.hashSync(user.password, salt)
        const hash = bcrypt.hashSync(user.password, 10)
        user.password = hash
    }
    return user
})

exports.schema = () => userSchema
exports.model = () => User