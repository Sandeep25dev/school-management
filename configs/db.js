const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configure Sequelize instance
const sequelize = new Sequelize(process.env.DB_CONNECTIONSTRING);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to MySQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
