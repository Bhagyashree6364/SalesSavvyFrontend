import React, { useState } from "react";
import { AdminApi } from "./api";
import CustomModal from "./CustomModal";
import "./styles.css";

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", fields: [], onSubmit: async () => {} });
  const [message, setMessage] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);

  const openModal = (config) => {
    setMessage("");
    setAnalyticsData(null);
    setModalConfig(config);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Add Product
  const handleAddProduct = () =>
    openModal({
      title: "Add Product",
      fields: [
        { name: "name", label: "Name" },
        { name: "description", label: "Description" },
        { name: "price", label: "Price", type: "number" },
        { name: "stock", label: "Stock", type: "number" },
        { name: "category", label: "Category" },
        { name: "imageUrl", label: "Image URL" },
      ],
      onSubmit: async (data) => {
        try {
          await AdminApi.addProduct(data);
          setMessage("Product added successfully");
          closeModal();
        } catch (err) {
          setMessage("Failed to add product");
        }
      },
    });

  // Delete Product
  const handleDeleteProduct = () =>
    openModal({
      title: "Delete Product",
      fields: [{ name: "productId", label: "Product ID", type: "number" }],
      onSubmit: async ({ productId }) => {
        try {
          await AdminApi.deleteProduct(productId);
          setMessage("Product deleted");
          closeModal();
        } catch {
          setMessage("Failed to delete product");
        }
      },
    });

  // Daily Business
  const handleDailyBusiness = () =>
    openModal({
      title: "Daily Business",
      fields: [{ name: "date", label: "Date", type: "date" }],
      onSubmit: async ({ date }) => {
        try {
          const res = await AdminApi.dailyBusiness(date);
          setAnalyticsData(res.data);
          setMessage("Fetched daily business");
        } catch {
          setMessage("Error fetching daily business");
        }
      },
    });

  // Monthly
  const handleMonthlyBusiness = () =>
    openModal({
      title: "Monthly Business",
      fields: [
        { name: "month", label: "Month (1-12)", type: "number" },
        { name: "year", label: "Year", type: "number" },
      ],
      onSubmit: async ({ month, year }) => {
        try {
          const res = await AdminApi.monthlyBusiness(month, year);
          setAnalyticsData(res.data);
          setMessage("Fetched monthly business");
        } catch {
          setMessage("Error fetching monthly business");
        }
      },
    });

  // Yearly
  const handleYearlyBusiness = () =>
    openModal({
      title: "Yearly Business",
      fields: [{ name: "year", label: "Year", type: "number" }],
      onSubmit: async ({ year }) => {
        try {
          const res = await AdminApi.yearlyBusiness(year);
          setAnalyticsData(res.data);
          setMessage("Fetched yearly business");
        } catch {
          setMessage("Error fetching yearly business");
        }
      },
    });

  // Overall
  const handleOverallBusiness = async () => {
    setMessage("");
    try {
      const res = await AdminApi.overallBusiness();
      setAnalyticsData(res.data);
      setMessage("Fetched overall business");
    } catch {
      setMessage("Error fetching overall business");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="card-grid">
        <div className="admin-card" onClick={handleAddProduct}>Add Product</div>
        <div className="admin-card" onClick={handleDeleteProduct}>Delete Product</div>
        <div className="admin-card" onClick={handleDailyBusiness}>Daily Business</div>
        <div className="admin-card" onClick={handleMonthlyBusiness}>Monthly Business</div>
        <div className="admin-card" onClick={handleYearlyBusiness}>Yearly Business</div>
        <div className="admin-card" onClick={handleOverallBusiness}>Overall Business</div>
      </div>

      {message && <p className="status-msg">{message}</p>}

      {analyticsData && (
        <div className="analytics-box">
          <pre>{JSON.stringify(analyticsData, null, 2)}</pre>
        </div>
      )}

      <CustomModal
        show={showModal}
        title={modalConfig.title}
        fields={modalConfig.fields || []}
        onSubmit={modalConfig.onSubmit}
        onClose={closeModal}
        submitLabel="Submit"
      />
    </div>
  );
}
