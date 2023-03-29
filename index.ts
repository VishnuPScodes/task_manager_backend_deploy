import express from "express";
import cors from "cors";
import { connectMongodb } from "./db/db";
import userController from "./controllers/registration.controller";
import tasksController from "./controllers/tasks.controller";
import loginController from "./controllers/login.controller";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const patchCorsOptions = {
  origin: "*",
  methods: ["PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cors());
app.options("*", cors(patchCorsOptions));
app.use(express.json());
app.options("/tasks/:id", cors());
app.use("/reg", userController);
app.use("/tasks", tasksController);
app.use("/log", loginController);
app.listen(3000, async () => {
  try {
    await connectMongodb();
    console.log("listening on port 3000");
  } catch (error) {
    console.log("server failed", error);
  }
});
