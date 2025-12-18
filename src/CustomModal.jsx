import React, { useState, useEffect } from "react";
import "./styles.css";

export default function CustomModal({ show, title, fields, onSubmit, onClose, submitLabel = "Submit" }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (show) {
      const init = {};
      fields.forEach((f) => (init[f.name] = ""));
      setFormData(init);
    }
  }, [show, fields]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required !== false}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
