import express from 'express';
import { User } from '../models/registration.model';
import { body,validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
const router=express.Router();
let newtoken=(userData:any)=>{
    if(process.env.SECRET){
        return jwt.sign({userData},process.env.SECRET)
    }
}
//login in the user 
router.post('/',body('email').isEmail(),async (req,res)=>{
    console.log('1')
    try {
        const error=validationResult(req.body);
        if(!error.isEmpty()){
            res.status(400).send({status:false,message:"wrong credentials"})
        }
        else{
              console.log("2");
            const userData=await User.findOne({email:req.body.email});
              console.log("3");
            if(!userData){
                res.status(400).send({
                    status:false,
                    message:"Email or password is wrong"
                })
                  console.log("4e");
            }
            else{
                console.log('before')
                  const check = userData.checkPassword(req.body.password);
                    console.log("5",check);
            if(!check){
                res.status(400).send({
                    status:false,
                    message:'Wrong email id or password'
                })
            }
            else{
                console.log(6)
            let token=newtoken(userData);
              console.log("7");
            res.status(200).send({
                status:true,
                message:"Successful",
                token
            })
            }
            }
          
        }
    } catch (error) {
        
    }
})

export default router