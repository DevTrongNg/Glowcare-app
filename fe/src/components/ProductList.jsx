// src/components/ProductList.jsx
import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      {products.length === 0 ? (
        <p>Không có sản phẩm nào</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} - {p.price}₫
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
