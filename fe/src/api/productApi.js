// src/api/productApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi API products:", error);
    return [];
  }
};
