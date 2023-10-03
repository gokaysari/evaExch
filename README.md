# EvaExchange Backend API

EvaExchange provides a platform for users to trade shares. This repository contains the backend RESTful API that powers the EvaExchange platform. The API supports user registration, login, share management, trading operations, and more.

# Features

# User Registration and Login
Secure user registration and login using bcrypt for password hashing.
Generation of JWT (JSON Web Token) for authenticated routes.

# Shares Management
Register new shares with symbol and price.
Update the price of existing shares.
Fetch all available shares.

# Portfolio Management
View a user's portfolio, including shares owned.

# Trading Operations
Buy shares.
Sell shares.

# Transaction History
View a user's transaction history.

# Middleware for JWT Authentication
Protects certain routes to ensure they can only be accessed with a valid JWT.

# Error Handling
Provides meaningful error messages for various scenarios.

# Database Models and Associations
Uses Sequelize as an ORM.
Models include Users, Shares, Portfolios, and Transactions with established associations.



# Prerequisites
Node.js
npm
PostgreSQL


# clone
git clone https://github.com/gokaysari/evaExch.git


# open the directory
cd evaExch


# Install dependencies:
npm install


# Set up your .env file from dotenv-example


Clone the repository:
git clone [repository-url]
cd EvaExchange


# Set up the database:
Ensure you have PostgreSQL set up and running.
Update the config/config.json file with your database credentials.


# Run migrations to set up the database tables:
npx sequelize-cli db:migrate


# Start the server:
npm start


# API Endpoints
# Trade (BUY)

URL: /trade/buy
Method: POST
Body Parameters:
userId: ID of the user.
shareSymbol: Symbol of the share.
quantity: Number of shares to buy.


# Trade (SELL)

URL: /trade/sell
Method: POST
Body Parameters:
userId: ID of the user.
shareSymbol: Symbol of the share.
quantity: Number of shares to sell.


# Testing
You can test the API using Postman. A Postman collection is provided for easy testing of all endpoints.




