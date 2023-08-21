import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  onAddClick,
  onRemoveClick,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total.toFixed(2)}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={onAddClick}
          disabled={orderedQuantity >= availableCount}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          onClick={onRemoveClick}
          disabled={orderedQuantity <= 0}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setIsLoading(false);
      });
  }, []);

  const calculateTotal = () => {
    let total = 0;
    products.forEach((product) => {
      total += product.price * product.orderedQuantity;
    });
    return total;
  };

  const handleAddClick = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, orderedQuantity: product.orderedQuantity + 1 }
          : product
      )
    );
  };

  const handleRemoveClick = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, orderedQuantity: product.orderedQuantity - 1 }
          : product
      )
    );
  };

  const orderTotal = calculateTotal();
  const discountApplied = orderTotal > 1000;

  return (
    <div>
      <header className={styles.header}>
        <h1>Checkout</h1>
      </header>
      <main>
        {isLoading ? <LoadingIcon /> : null}
        {!isLoading && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th># Available</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                console.log(products.orderTotal);

                return (
                  <Product
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    availableCount={product.availableCount}
                    price={product.price}
                    orderedQuantity={product.orderedQuantity}
                    total={product.price * product.orderedQuantity}
                    onAddClick={() => handleAddClick(product.id)}
                    onRemoveClick={() => handleRemoveClick(product.id)}
                  />
                );
              })}
            </tbody>
          </table>
        )}
        <h2>Order summary</h2>
        <p>
          Discount: {discountApplied ? "$" + (orderTotal * 0.1).toFixed(2) : "$0.00"}
        </p>
        <p>
          Total: ${discountApplied ? (orderTotal * 0.9).toFixed(2) : orderTotal.toFixed(2)}
        </p>
      </main>
    </div>
  );
};

export default Checkout;
