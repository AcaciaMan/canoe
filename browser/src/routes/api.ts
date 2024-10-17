import { Router } from "express";
import exampleController from "../controllers/exampleController";

const router = Router();

// Define routes
router.get("/example", exampleController.getExample);



export default router;
