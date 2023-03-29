import express from "express";
import { TasksList } from "../models/tasks.model";
import { authenticate } from "../middlewares/authentication";
import { CustomRequest } from "../middlewares/authentication";
import cors from 'cors'
const router = express.Router();

//get
router.get("/", authenticate, async (req: CustomRequest, res) => {
  let userId = req.user?.userData._id;
  try {
    const data = await TasksList.findOne({ userId: userId }).lean().exec();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//posting datas of task
router.post("/", authenticate, async (req: CustomRequest, res) => {
  let userId = req.user?.userData._id;
  let postData = {
    userId: userId,
    tasks: req.body.tasks,
  };
  try {
    let userTask = await TasksList.findOne({ userId: userId });
    if (!userTask) {
      const data = await TasksList.create(postData);
      console.log("my user", req.user?.userData._id);
      res.status(200).send(data);
    } else {
      const taskDoc = await TasksList.findOneAndUpdate(
        { userId },
        { $push: { tasks: req.body.tasks } },
        { new: true, upsert: true }
      );
      res.status(200).send({ message: "task added ", data: taskDoc });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});



// Update a task by ID
router.post("/:id",cors(), async (req, res) => {
  console.log('here');
  try {
    const taskId = req.params.id;
    const updatedFields = req.body;
    const result = await TasksList.findOneAndUpdate(
      { "tasks._id": taskId },
      { $set: { "tasks.$": updatedFields } },
      { returnOriginal: false }
    );
    if (!result) {
      return res.status(400).json({ message: "Task not found" });
    }
    else{
      res.status(200).send(result);
    }
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deleting a task by ID
router.delete("/:id", cors(), async (req, res) => {
  try {
    const taskId = req.params.id;
    const result = await TasksList.findOneAndUpdate(
      { "tasks._id": taskId },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );
    if (!result) {
      return res.status(400).json({ message: "Task not found" });
    }
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
