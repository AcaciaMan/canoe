import { Router } from "express";
import exampleController from "../controllers/exampleController";
import keyEventController from "../controllers/keyEventController";
import svgController from "../controllers/svgController";

const router = Router();

// Define routes
router.get("/example", exampleController.getExample);
// Define routes
router.post("/key-event", keyEventController.handleKeyEvent);

router.get("/svg", svgController.getSVG1);


export default router;
