const router = require('express').Router();
const { body, param } = require('express-validator');
const { authenticateToken } = require('../middlewares/jwt');
const {createTask, updateTask, deleteTask} = require('../controllers/taskController');


router.post('/create', [
  authenticateToken,
  
  body('title').notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  
  body('description').notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('due_date').notEmpty().withMessage('Due date is required')
  .isISO8601().toDate().withMessage('Invalid date format for due_date'),
  
  body('user').notEmpty().withMessage('User is required'),
  
], createTask)


router.put('/update/:taskId', [
  authenticateToken,
  
  param('taskId').exists().withMessage('Task id is required'),
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('due_date').optional().isISO8601().toDate().withMessage('Invalid date format for due_date'),
  body('status').optional().isIn(['TODO', 'IN PROGRESS', 'DONE']).withMessage('Status must be one of TODO, IN PROGRESS, DONE'),
  body('user').notEmpty().withMessage('User is required'),

  
], updateTask)


router.delete('/delete/:taskId', [
  authenticateToken,
  
  param('taskId').exists().withMessage('Task id is required'),
  body('user').notEmpty().withMessage('User is required'),
  
], deleteTask)



module.exports = router;