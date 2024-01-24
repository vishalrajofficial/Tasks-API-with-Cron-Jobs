const cron = require('node-cron');
const { Task } = require('../models/taskModel');
const { getPriority } = require('../utils/taskUtils');

const updateTaskPriorities = () => {
    console.log(`Updating task priorities at ${new Date()}`);
    
    Task.findAll()
        .then((tasks) => {
            tasks.forEach((task) => {
                const newPriority = getPriority(task.due_date);

                task.update({ priority: newPriority })
                    .then(() => {
                        console.log('Task priorities updated successfully.');
                    })
                    .catch((error) => {
                        console.error('Error updating task priorities:', error);
                    });
            });
        })
        .catch((error) => {
            console.error('Error fetching tasks:', error);
        });
};

const scheduleUpdateTaskPriorities = () => {
    cron.schedule('0 */12 * * *', () => {
        updateTaskPriorities();
    }, { timezone: 'Asia/Kolkata', scheduled: true });
}

module.exports = {
    scheduleUpdateTaskPriorities,
}
