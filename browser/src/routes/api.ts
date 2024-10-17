import { Router } from "express";
import exampleController from "../controllers/exampleController";
import keyEventController from "../controllers/keyEventController";

const router = Router();

// Define routes
router.get("/example", exampleController.getExample);
// Define routes
router.post("/key-event", keyEventController.handleKeyEvent);



export default router;
