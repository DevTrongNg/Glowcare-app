// index.js
const express = require("express");
const app = express();
const productRoutes = require("./routes/product.routes");

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


// const cors = require("cors");
// app.use(cors());
