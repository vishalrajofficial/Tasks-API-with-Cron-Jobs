const {Task} = require('./taskModel');
const {User} = require('./userModel');
const {SubTask} = require('./subTaskModel');

const createAssociations = () => {
    User.hasMany(Task, {foreignKey: 'user_id'});
    Task.belongsTo(User, {foreignKey: 'user_id'});
    Task.hasMany(SubTask, {foreignKey: 'task_id'});
    SubTask.belongsTo(Task, {foreignKey: 'task_id'});
}

module.exports = createAssociations;