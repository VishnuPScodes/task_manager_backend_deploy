import mongoose from 'mongoose'


export const connectMongodb =()=>{
 return mongoose.connect(
   "mongodb+srv://psvishnu373:vishnu@cluster0.dyftydh.mongodb.net/?retryWrites=true&w=majority"
 );
 }