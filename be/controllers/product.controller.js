// controllers/product.controller.js
const Product = require("../models/product.model");

exports.getAll = (req, res) => {
    res.json(Product.findAll());
};

exports.getOne = (req, res) => {
    const id = parseInt(req.params.id);
    const product = Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
};

exports.create = (req, res) => {
    const newProduct = Product.create(req.body);
    res.status(201).json(newProduct);
};

exports.update = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = Product.update(id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
};

exports.remove = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = Product.remove(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted successfully" });
};
