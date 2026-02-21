import express from 'express';
import { adminDashboarddata, getallshows, getbookings, isAdmin } from '../Control/Admincontrol.js';
import { protectAdmin } from '../Middleware/Auth.js';
import Movie from "../models/Movie.js";     
const adminRouter = express.Router();

adminRouter.get('/isAdmin',protectAdmin , isAdmin )
adminRouter.get('/dashboarddata', protectAdmin, adminDashboarddata);
adminRouter.get('/getallshows', protectAdmin,getallshows);
adminRouter.get('/getallbookings', protectAdmin, getbookings);
adminRouter.get("/movies", protectAdmin, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ success: true, movies });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});
export default adminRouter;