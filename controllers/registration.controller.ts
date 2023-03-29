import express from "express";
import { User } from "../models/registration.model";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { TasksList } from "../models/tasks.model";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

//making a token using the credentials from the user
let secret=process.env.SECRET;

let newToken = (userData:any) => {
  if(process.env.SECRET){
 return jwt.sign({ userData }, process.env.SECRET);
  }
  else{
  console.log('no data')
  }
 
};

//making a get request to get the data from the api

router.get("/", async (req, res) => {
  try {
    const data = await User.find().lean().exec();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//post (registration process)

router.post("/", body("email").isEmail(), async (req, res) => {
  try {
    let errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      res.status(400).send({ status: "failed", message: "wrong credentials" });
    } else {
      let userData = await User.findOne({ email: req.body.email });
      if (userData) {
        res
          .status(400)
          .send({ status: "failed", message: "user already exists" });
      } else {
        let userTask
        userData = await User.create(req.body);
        let token=newToken(userData);
        res.status(200).send({token})
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//update

router.patch("/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//delete

router.delete("/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default router;
