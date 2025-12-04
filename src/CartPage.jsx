import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:9090/api/cart", {
        withCredentials: true,
      });
      const data = response.data;
      setItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
      console.log("Cart fetched from backend:", data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) {
      handleRemove(productId);
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:9090/api/cart/update",
        { productId: productId, quantity: newQty },
        { withCredentials: true }
      );
      const data = response.data;
      setItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await axios.delete(
        "http://localhost:9090/api/cart/delete",
        {
          data: { productId: productId },
          withCredentials: true,
        }
      );
      const data = response.data;
      setItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  // ---------------- PAYMENT HANDLER ----------------
  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        alert("Cart is empty");
        return;
      }

      console.log("Items before checkout:", items);

      // Validate items BEFORE sending to backend
      const invalidItem = items.find(
        (it) =>
          it.productId == null ||
          it.quantity == null ||
          it.price == null
      );
      if (invalidItem) {
        console.error("Invalid cart item:", invalidItem);
        alert(
          "Cart data is invalid on frontend (missing productId, quantity or price). Please refresh the page and try again."
        );
        return;
      }

      // Build request body for backend /api/payment/create
      const requestBody = {
        totalAmount: totalAmount,
        cartItems: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price_per_unit: item.price,
        })),
      };

      console.log("Payment requestBody being sent:", requestBody);

      // Create Razorpay order on backend
      const createRes = await fetch("http://localhost:9090/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const createText = await createRes.text();
      if (!createRes.ok) {
        throw new Error(createText || "Failed to create payment order");
      }

      const razorpayOrderId = createText;

      // Razorpay options
      const options = {
        key: "rzp_test_RnW4t4iBBW3r34", // test key
        amount: totalAmount * 100, // in paise
        currency: "INR",
        name: "SalesSavvy",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "http://localhost:9090/api/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const result = await verifyRes.text();

            if (verifyRes.ok) {
              alert("Payment verified successfully!");
              await fetchCart(); // refresh cart (should be empty)
              navigate("/customerhome");
            } else {
              alert("Payment verification failed: " + result);
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Error during checkout. Please try again.");
    }
  };
  // -------------------------------------------------

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Price: ₹{item.price}</p>
                  <p>Subtotal: ₹{item.line_total || item.lineTotal}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button onClick={() => handleRemove(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ₹{totalAmount}</h3>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;


