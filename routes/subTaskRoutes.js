// Import necessary modules
const router = require('express').Router();
const { authenticateToken } = require('../middlewares/jwt');
const { createSubTask, updateSubTask, deleteSubTask } = require('../controllers/subTaskController');
const { body, param } = require('express-validator');

// Route for creating a subtask
router.post('/create', [
  authenticateToken, // Authenticate user with a token

  // Validate request body
  body('task_id').exists().withMessage('Task ID is required')
    .isInt().withMessage('Task ID must be an integer'),

], createSubTask);

// Route for updating a subtask
router.put('/update/:subTaskId', [
  authenticateToken, // Authenticate user with a token

  // Validate request parameters and body
  param('subTaskId').exists().withMessage('Sub Task ID is required'),
  body('status').exists().withMessage('Status is required')
    .isInt().withMessage('Status must be an integer')
    .isIn([0, 1]).withMessage('Status must be 0 or 1'),

], updateSubTask);

// Route for deleting a subtask
router.delete('/delete/:subTaskId', [
  authenticateToken, // Authenticate user with a token

  // Validate request parameters
  param('subTaskId').exists().withMessage('Sub Task ID is required'),

], deleteSubTask);

// Export the router for use in other files
module.exports = router;
