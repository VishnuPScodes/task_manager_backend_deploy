import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

interface IUser {
  userData: {
    _id: string;
  };
}
export interface CustomRequest extends Request {
  user?: IUser;
}
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const verifyToken = (token: any) => {
  return new Promise((resolve, reject) => {
    if (process.env.SECRET) {
      jwt.verify(token, process.env.SECRET, (err: any, user: any) => {
        if (err) {
          return reject(err);
        } else {
          resolve(user);
        }
      });
    } else {
      console.log("secret key not added in the env");
    }
  });
};

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check weather autherization header is set
  //if not throw an error
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send({ message: "Authorization token was not provided" });
  }

  //if bearer token in autherization header

  //if not throw an error
  if (!req.headers.authorization.startsWith("Bearer ")) {
    return res
      .status(400)
      .send({ message: "Authorization token was not provided" });
  }
  //else split the bearer token and get the [1] which is the token
  const token = req.headers.authorization.split(" ")[1];

  //then we will call jwt to verify the token
  //if token is invalid we will throw error

  let user: any;
  try {
    user = await verifyToken(token);
    req.user = user;
  } catch (error) {
    res.status(400).send({ message: "Authorization token was not provided" });
  }

 // console.log(req.user);
  //if the token is valid then we will user retrived from the token in the request object

  next();
};
