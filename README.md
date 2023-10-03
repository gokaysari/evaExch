/evaExchange
|-- /node_modules
|-- /models
|   |-- user.js
|   |-- share.js
|   |-- portfolio.js
|   |-- transaction.js
|   |-- index.js
|-- /migrations
|   |-- 20231003120646-create-shares
|   |-- 20231003120657-create-users
|   |-- 20231003120703-create-portfolios
|   |-- 20231003120710-create-transactions
|-- /seeders
|-- /config
|   |-- config.json
|-- package.json
|-- server.js
|-- README.md 



Setup

Clone the repository:
git clone [repository-url]
cd EvaExchange


Install dependencies:
npm install


Set up the database:
Ensure you have PostgreSQL set up and running.
Update the config/config.json file with your database credentials.


Run migrations to set up the database tables:
npx sequelize-cli db:migrate


Start the server:
npm start


API Endpoints
Trade (BUY)

URL: /trade/buy
Method: POST
Body Parameters:
userId: ID of the user.
shareSymbol: Symbol of the share.
quantity: Number of shares to buy.
Trade (SELL)

URL: /trade/sell
Method: POST
Body Parameters:
userId: ID of the user.
shareSymbol: Symbol of the share.
quantity: Number of shares to sell.


Testing
You can test the API using Postman. A Postman collection is provided for easy testing of all endpoints.


Contributing
If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.
