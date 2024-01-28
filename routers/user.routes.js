import express from "express";
import {
  about,
  adminLogin,
  adminRegister,
  complaine,
  contact,
  deleteDataCom,
  deleteDataFromDb,
  getData,
  main,
  userLogin,
  userRegister,
  view,
  viewComplain,
  viewLogin,
  viewRegister,
  viewadminLogin,
  viewadminRegister,
} from "../controllers/user.controller.js";
 
const UserRoute = express.Router();

UserRoute.post("/delete/:id/:index",deleteDataCom);
UserRoute.get("/about",about);
UserRoute.get("/contact",contact);
UserRoute.get("/viewusercomplain/:id",viewComplain);
UserRoute.get("/viewadminregister",viewadminRegister);
UserRoute.get("/viewadminlogin",viewadminLogin);
UserRoute.get("/viewregister",viewRegister);
UserRoute.get("/viewlogin",viewLogin);
UserRoute.get("/home",main);
UserRoute.post("/register", userRegister);  
UserRoute.post("/registeradmin", adminRegister);
UserRoute.post("/login", userLogin);
UserRoute.post("/loginadmin", adminLogin);
UserRoute.get("/data", getData);
UserRoute.post("/complaine", complaine);
UserRoute.post("/deletedata", deleteDataFromDb);
UserRoute.get("/views",view);


export default UserRoute;
