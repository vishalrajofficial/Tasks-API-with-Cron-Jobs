const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');


const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
},{
    freezeTableName: true,
    timestamps: true,
    paranoid: true 
});


module.exports = {
    User,
};
