const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const schoolRoutes = require("./routes/schoolRoutes");
const sequelize = require("./configs/db");
require("dotenv").config();

const PORT = 3000;

app.use(bodyParser.json());

app.use("/api/schools", schoolRoutes);

app.listen(PORT, async function () {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server is running on PORT ${PORT}`);
  } catch (err) {
    console.error("Error syncing database:", err);
  }
});
