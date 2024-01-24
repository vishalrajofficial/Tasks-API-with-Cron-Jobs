const { CustomError } = require('../middlewares/errorHandler');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../configs/globalConfig')
const { User } = require('../models/userModel')


const signUpController = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(422, errors.array({onlyFirstError: true}).map((err)=>err.msg).join(', ')));
    }

    const { phone_number, priority } = req.body;

    User.findOne({where: {phone_number}}).then(user => {
        if(user) {
            throw new CustomError(409, 'Phone number already in use');
        }
    }).catch(err => {
        next(err);
    })

    User.create({phone_number, priority})
        .then(user => {
            const token = jwt.sign({id: user.id, phone_number: user.phone_number}, config.jwtSecret, {expiresIn: '1h'});
            res.status(201).json({token});
        })
        .catch(err => {
            next(err);
        });
}


const logInController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(422, errors.array({onlyFirstError: true}).map((err)=>err.msg).join(', ')));
    }

    const { phone_number } = req.body;

    User.findOne({where: {phone_number}})
        .then(user => {
            if (!user) {
                throw new CustomError(404, 'Phone number not found');
            }
            const token = jwt.sign({id: user.id, phone_number: user.phone_number}, config.jwtSecret, {expiresIn: '1h'});
            res.status(200).json({token});
        })
        .catch(err => {
            next(err);
        });
}


const getAllTasks = (req, res, next) => {
    const user_id = req.body.user.id;

    User.findOne({ where: { id: user_id } })
        .then(user => {
            if (!user) {
                throw new CustomError(404, 'User not found');
            }

            const { priority, due_date } = req.query;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;

            const filterOptions = {
                where: {
                    user_id: user.id,
                },
                limit: pageSize,
                offset: (page - 1) * pageSize
            };

            if(priority !== undefined){
                filterOptions.where.priority = priority;
            }

            if(due_date !== undefined){
                filterOptions.where.due_date = due_date;
            }

            return user.getTasks(filterOptions);
        })
        .then(tasks => {
            res.status(200).json(tasks);
        })
        .catch(err => {
            next(err);
        });
};



const getAllSubTasks = (req, res, next) => {
    const user_id = req.body.user.id;

    const { status, task_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    User.findOne({where: {id: user_id}}).then(user => {
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        
        const filterOptions = {}

        if(task_id !== undefined){
            filterOptions.where = {
                id: task_id
            }
        }

        return user.getTasks(filterOptions);

    }).then(tasks => {

        const filterOptions = {
            limit: pageSize,
            offset: (page - 1) * pageSize
        };

        if(status !== undefined){
            filterOptions.where = {
                status: status
            }
        }

        const promises = tasks.map(task => task.getSubTasks(filterOptions));
        return Promise.all(promises);

    }).then(subTasks => {
        res.status(200).json(subTasks);

    }).catch(err => {
        next(err);
    })
}


module.exports = {
    signUpController, 
    logInController,
    getAllTasks,
    getAllSubTasks,
}