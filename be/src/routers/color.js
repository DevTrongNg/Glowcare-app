import { Router } from "express";
import {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} from "../controllers/color.controller";

const router = Router();

router.get("/", getColors);
router.get("/:id", getColorById);
router.post("/", createColor);
router.put("/:id", updateColor);
router.delete("/:id", deleteColor);

export default router;
