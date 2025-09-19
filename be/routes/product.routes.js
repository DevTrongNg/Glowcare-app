// routes/product.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
