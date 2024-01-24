const { CustomError } = require('../middlewares/errorHandler');
const { validationResult } = require('express-validator')
const { Task } = require('../models/taskModel')
const { User } = require('../models/userModel');
const {getPriority} = require('../utils/taskUtils')

const createTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(422, errors.array({ onlyFirstError: true }).map((err) => err.msg).join(', ')));
    }

    const { title, description, due_date, user } = req.body;
    const user_id = user.id;

    User.findOne({ where: { id: user_id } })
        .then(userModel => {
            if (!userModel) {
                throw new CustomError(404, 'User not found');
            }

            const priority = getPriority(due_date);

            return userModel.createTask({ title, description, due_date, priority });
        })
        .then(task => {
            res.status(201).json(task);
        })
        .catch(err => {
            next(err);
        });
};


const updateTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(422, errors.array({ onlyFirstError: true }).map((err) => err.msg).join(', ')));
    }

    const { title, description, due_date, status, user } = req.body;
    const user_id = user.id;
    const task_id = req.params.taskId;

    Task.findOne({ where: { id: task_id, user_id: user_id } })
        .then(task => {
            if (!task) {
                throw new CustomError(404, 'Task not found or unauthorized user');
            }

            const updatedFields = {};
            if (title !== undefined) updatedFields.title = title;
            if (description !== undefined) updatedFields.description = description;
            if (due_date !== undefined){
                updatedFields.due_date = due_date;
                updatedFields.priority = getPriority(due_date);
            }
            if (status !== undefined) updatedFields.status = status;

            return task.update(updatedFields);
        })
        .then(updatedTask => {
            res.status(200).json(updatedTask);
        })
        .catch(err => {
            next(err);
        });
};


const deleteTask = (req, res, next) => {
    const task_id = req.params.taskId;
    const user_id = req.body.user.id; 

    Task.findOne({ where: { id: task_id, user_id: user_id } })
        .then(task => {
            if (!task) {
                throw new CustomError(404, 'Task not found or unauthorized user');
            }

            return task.destroy();
        })
        .then(() => {
            res.status(200).json({ message: 'Task deleted successfully' });
        })
        .catch(err => {
            next(err);
        });
};


module.exports = {
    createTask, 
    updateTask,
    deleteTask,
}
