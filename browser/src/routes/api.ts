import { Router } from "express";
import exampleController from "../controllers/exampleController";
import keyEventController from "../controllers/keyEventController";
import svgController from "../controllers/svgController";
import hslController from "../controllers/hslController";

const router = Router();

// Define routes
router.get("/example", exampleController.getExample);
// Define routes
router.post("/key-event", keyEventController.handleKeyEvent);

router.get("/svg", svgController.getSVG1);

router.get("/hsl", hslController.getHSL);


export default router;
