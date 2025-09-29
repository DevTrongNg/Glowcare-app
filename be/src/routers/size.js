import { Router } from "express";
import { createSize, deleteSize, getAllSizes, getSizeById, updateSize } from "../controllers/size";

const router = Router();

router.get("/", getAllSizes);
router.get("/:id", getSizeById);
router.post("/", createSize);
router.put("/:id", updateSize);
router.delete("/:id", deleteSize);

export default router;
