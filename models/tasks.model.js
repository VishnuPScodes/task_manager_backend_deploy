import mongoose from "mongoose";


const taskListSchema =new mongoose.Schema({
  task_name: {
    type: String,
    requied: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export const tasksSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    tasks:[taskListSchema],
   
});

export const TasksList=mongoose.model("task",tasksSchema);