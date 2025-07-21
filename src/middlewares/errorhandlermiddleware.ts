import express from "express";
import { Request,Response,NextFunction } from "express";

class CustomError extends Error{
  statusCode: number
  success: boolean
  status: 'error' | 'fail'

  constructor(message:string,statusCode:number) {
    super(message);
    this.statusCode = statusCode
    this.status = statusCode >=400 && statusCode < 500 ? 'fail' : 'error'
    this.success = false
  }
}

export const errorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
  const statusCode = err?.statusCode || 500
  const success = err?.success || false
  const status = err?.status || 'error'
  const message = err?.message || 'Internal server error'

  res.status(statusCode).json({
    message,
    success,
    status,
    data:null
  })
}

export default CustomError;