const { CustomError } = require('../middlewares/errorHandler');
const { validationResult } = require('express-validator')
const { Task } = require('../models/taskModel')
const { SubTask } = require('../models/subTaskModel')


const createSubTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(422, errors.array({ onlyFirstError: true }).map((err) => err.msg).join(', ')));
    }

    const { task_id } = req.body;
    const user_id = req.body.user.id;

    Task.findOne({ where: { id: task_id, user_id: user_id } })
        .then(task => {
            if (!task) {
                throw new CustomError(404, 'Task not found or unauthorized user');
            }

            return task.createSubTask({ status: 0 });
        })
        .then(subTask => {
            res.status(201).json(subTask);
        })
        .catch(err => {
            next(err);
        });
}


const updateSubTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(422, errors.array({ onlyFirstError: true }).map((err) => err.msg).join(', ')));
    }

    const { status } = req.body;
    const user_id = req.body.user.id;
    const subTaskId = req.params.subTaskId;

    SubTask.findOne({ where: { id: subTaskId, '$Task.user_id$': user_id }, include: { model: Task, attributes: [], where: { user_id: user_id } } })
        .then(subTask => {
            if (!subTask) {
                throw new CustomError(404, 'SubTask not found or unauthorized user');
            }

            subTask.status = status;
            return subTask.save();
        })
        .then(subTask => {
            res.status(200).json(subTask);
        })
        .catch(err => {
            next(err);
        });
}


const deleteSubTask = (req, res, next) => {
    const user_id = req.body.user.id;
    const subTaskId = req.params.subTaskId;

    SubTask.findOne({ where: { id: subTaskId, '$Task.user_id$': user_id }, include: { model: Task, attributes: [], where: { user_id: user_id } } })
        .then(subTask => {
            if (!subTask) {
                throw new CustomError(404, 'SubTask not found or unauthorized user');
            }

            return subTask.destroy();
        })
        .then(() => {
            res.status(200).json({ message: 'SubTask deleted' });
        })
        .catch(err => {
            next(err);
        });
}


module.exports = {
    createSubTask,
    updateSubTask,
    deleteSubTask
}