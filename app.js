const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const schoolRoutes = require("./routes/schoolRoutes");
const sequelize = require("./configs/db");
require("dotenv").config();

app.use(bodyParser.json());

app.use("/api/schools", schoolRoutes);

const port = process.env.SERVER_PORT || 3001;

app.listen(port, async function () {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server is live on PORT ${port}`);
  } catch (err) {
    console.error("Error syncing database:", err);
  }
});
