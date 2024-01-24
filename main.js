// Import required modules
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./configs/globalConfig')
const initializeDatabase = require('./database')
const sequelize = require('./configs/sequelize')
const { handleError, CustomError } = require('./middlewares/errorHandler')
const createAssociations = require('./models/associations')
const { scheduleOverDueTasks } = require('./cronJobs/twilioVoiceCallCron')
const { scheduleUpdateTaskPriorities } = require('./cronJobs/taskPriorityCron')

// Create an Express application
const app = express()
const PORT = config.port || 8000

// Middleware setup
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Report check endpoint
app.use('/api/v1/report', (req, res) => res.json({ status: 'ready', timestamp: new Date() }))

// Define routes for users, tasks, and subtasks
app.use('/api/v1/users', require('./routes/userRoutes'))
app.use('/api/v1/tasks', require('./routes/taskRoutes'))
app.use('/api/v1/subtasks', require('./routes/subTaskRoutes'))

// Catch-all route for any other endpoint
app.all('*', (req, res) => {
    res.send("Server is running...")
})

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res)
})

// Initialize database, create associations, and start the server
initializeDatabase().then(() => {
    createAssociations()
    sequelize.sync().then(() => {
        // Start the server
        app.listen(PORT, () => {

            // Schedule cron jobs
            scheduleUpdateTaskPriorities();
            scheduleOverDueTasks();

            console.log(`Server is running on port ${PORT}`)
        })
    }).catch((err) => {
        console.error('Unable to connect to the database:', err);
    })
}).catch((err) => {
    console.log(err)
})
