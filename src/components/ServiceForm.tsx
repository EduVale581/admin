"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { Service } from "@/lib/types";

interface ServiceFormProps {
  onServiceAdded?: (service: Service) => void;
}

export default function ServiceForm({ onServiceAdded }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    companyId: "",
    name: "",
    price: "",
    status: "active" as const,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const serviceData = {
        companyId: formData.companyId,
        name: formData.name,
        price: parseFloat(formData.price),
        status: formData.status,
      };

      console.log("[ServiceForm] Creating service:", serviceData);
      const response = await api.post("/api/services", serviceData);
      console.log("[ServiceForm] Service created successfully:", response);

      if (response.id) {
        setSuccess(true);
        setFormData({
          companyId: "",
          name: "",
          price: "",
          status: "active",
        });

        if (onServiceAdded) {
          console.log("[ServiceForm] Calling onServiceAdded callback");
          onServiceAdded(response);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to create service");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#0c0c0c",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Create New Service</h2>

      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: "rgb(221, 235, 221)",
            border: "1px solid #cfc",
            color: "#3c3",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
          }}
        >
          Service created successfully!
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="companyId"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Company ID *
        </label>
        <input
          type="text"
          id="companyId"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          required
          placeholder="Enter company ID"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="name"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Service Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter service name"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="price"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Price *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="0.00"
          step="0.01"
          min="0"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="status"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? "#999" : "#0ae240",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {loading ? "Creating..." : "Create Service"}
      </button>
    </form>
  );
}
