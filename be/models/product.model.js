// models/product.model.js
let products = [
    { id: 1, name: "Nike Air Max", price: 120, stock: 10 },
    { id: 2, name: "Adidas Ultraboost", price: 150, stock: 5 },
];

module.exports = {
    findAll: () => products,
    findById: (id) => products.find((p) => p.id === id),
    create: (product) => {
        product.id = products.length + 1;
        products.push(product);
        return product;
    },
    update: (id, newData) => {
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...newData };
            return products[index];
        }
        return null;
    },
    remove: (id) => {
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
            return products.splice(index, 1);
        }
        return null;
    },
};
