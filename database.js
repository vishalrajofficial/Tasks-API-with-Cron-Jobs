// Import required modules
const sql = require('mysql2/promise');
const config = require('./configs/globalConfig');

// Extract necessary database configuration from global configuration
const { host, port, user, password, database } = config.db;

// Function to initialize the database
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // Create a database connection
        sql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
        }).then((connection) => {
            // Attempt to create the specified database if it doesn't exist
            connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`)
                .then(() => {
                    console.log('Database Connected');
                    // Close the connection after successful database creation
                    connection.end();
                    resolve();
                })
                .catch((error) => {
                    console.error('Unable to create database:', error);
                    // Close the connection in case of an error
                    connection.end();
                    reject(error);
                });
        }).catch((error) => {
            console.error('Unable to establish database connection:', error);
            reject(error);
        });
    });
}

// Export the initializeDatabase function for external use
module.exports = initializeDatabase;
