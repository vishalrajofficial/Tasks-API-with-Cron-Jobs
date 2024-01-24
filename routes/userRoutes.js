const router = require('express').Router();
const { body, query } = require('express-validator');
const { signUpController, logInController, getAllTasks, getAllSubTasks } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/jwt');


router.post('/signup', [
  body('priority')
    .exists().withMessage('Priority is required')
    .isIn([0, 1, 2]).withMessage('Priority must be 0, 1, or 2'),

  body('phone_number')
    .exists().withMessage('Phone number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits')
    .matches(/^[0-9]+$/).withMessage('Phone number must be numeric')

], signUpController);


router.post('/login', [
  body('phone_number')
    .exists().withMessage('Phone number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits')
    .matches(/^[0-9]+$/).withMessage('Phone number must be numeric')

], logInController);


router.get('/tasks', [
  authenticateToken,
  
  query('priority').optional().isIn(['0', '1', '2']).withMessage('Priority must be 0, 1, or 2'),
  query('due_date').optional().isISO8601().toDate().withMessage('Invalid date format for due_date'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be a positive integer'),

], getAllTasks);


router.get('/subtasks', [
  authenticateToken,

  query('status').optional().isIn(['0', '1']).withMessage('Status must be 0, 1'),
  query('task_id').optional().isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be a positive integer'),

], getAllSubTasks)


module.exports = router;
