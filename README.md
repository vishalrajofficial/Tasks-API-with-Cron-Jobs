# Tasks API with Cron Jobs

This project is a Node.js backend that provides a Tasks API with integrated Cron Jobs. It uses MySQL as the database and is configured with Docker Compose for easy deployment.

## Prerequisites

Before running the application, ensure you have the following installed on your system:

- Node.js
- MySQL

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/vishalrajofficial/Tasks-API-with-Cron-Jobs.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Tasks-API-with-Cron-Jobs
   ```

3. Create a `.env` file in the root directory and set the required environment variables:

   ```dotenv
   DB_HOST=mysqldb
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_PORT=your_db_port
   SERVER_PORT=your_server_port
   JWT_SECRET=your_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```
4. Run the application on your local machine:

   ```bash
   npm install
   npm start
   ```

   This will install the required dependencies and start the Node.js application.

5. Access the application at [http://localhost:8000](http://localhost:8000).


### Run the application with Docker Compose:

   ```bash
   docker-compose up -d
   ```

   This will build and start the MySQL and Node.js services defined in the `docker-compose.yml` file.

## Key Features

- CRUD operations for tasks.
- Integration with cron jobs for task scheduling.
- Authentication and authorization using JWT.
- SMS notifications using Twilio.
- Docker Compose for easy deployment.