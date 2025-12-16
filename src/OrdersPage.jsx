// src/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:9090/api/orders", {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  if (orders.length === 0) {
    return <p>You have no orders yet.</p>;
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="order-card">
          <div className="order-header">
            <span>Order #{order.orderId}</span>
            <span>{new Date(order.orderDate).toLocaleString()}</span>
            <span>Status: {order.status}</span>
            <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} />
                )}
                <div>
                  <p>{item.productName}</p>
                  <p>
                    {item.quantity} x ₹{item.pricePerUnit.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
