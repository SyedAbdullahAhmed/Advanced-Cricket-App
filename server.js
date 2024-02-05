require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const userInfoRouter = require("./routes/user");
const teamRouter = require("./routes/team");
const playerRouter = require("./routes/player");
const matchRouter = require("./routes/match");
const adminRouter = require("./routes/admin");
const scoreUpdatorRouter = require("./routes/scoreUpdator");
const connectDB = require("./connections/connectionDB");
const port = 8000;
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//database
connectDB();

//middleware
app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/user", userInfoRouter);
app.use("/player", playerRouter);
app.use("/team", teamRouter);
app.use("/match", matchRouter);
app.use("/admin", adminRouter);
app.use(scoreUpdatorRouter)
//app

app.listen(port, () => console.log(`app running on port ${port}`));

app.get("/", (req, res) => {
  res.status(200).send("khelaao app running");
});


