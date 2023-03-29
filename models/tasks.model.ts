import mongoose from "mongoose";

interface taskInter {
  task_name: string;
  description: string;
  date: string;
}
interface Tasks {
  userId:mongoose.Schema.Types.ObjectId,
  tasks:taskInter[]
}

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

export const tasksSchema=new mongoose.Schema<Tasks>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    tasks:[taskListSchema],
   
});

export const TasksList=mongoose.model("task",tasksSchema);