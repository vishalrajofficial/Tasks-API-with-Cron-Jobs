const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');


const SubTask = sequelize.define('SubTask', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Task',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
},{
    freezeTableName: true,
    timestamps: true,
    paranoid: true,    
});


module.exports = {
    SubTask
};
