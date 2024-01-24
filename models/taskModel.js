const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');


const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        enum: [0, 1, 2, 3],
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'TODO',
        enum: ['TODO', 'IN PROGRESS', 'DONE'],
    }
},{
    freezeTableName: true,
    timestamps: true,
    paranoid: true,    
});

module.exports = {
    Task,
}
