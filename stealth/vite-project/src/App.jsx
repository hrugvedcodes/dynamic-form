import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const mockApiResponses = {
  userInformation: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true, minLength: 2 },
      { name: "lastName", type: "text", label: "Last Name", required: true, minLength: 2 },
      { name: "age", type: "number", label: "Age", required: true, min: 1, max: 120 },
    ],
  },
  addressInformation: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true, minLength: 5 },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: [
          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
          "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
          "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
          "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
          "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: true, pattern: /^[0-9]{5,6}$/ },
    ],
  },
  paymentInformation: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true, pattern: /^[0-9]{16}$/ },
      { name: "cardHolder", type: "text", label: "Card Holder Name", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true, pattern: /^[0-9]{3}$/ },
    ],
  },
};

const DynamicForm = () => {
  const { control, handleSubmit, reset, setError, formState: { errors } } = useForm();
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [submittedData, setSubmittedData] = useState({
    userInformation: [],
    addressInformation: [],
    paymentInformation: [],
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleFormTypeChange = (event) => {
    const type = event.target.value;
    setFormType(type);
    setFormFields(mockApiResponses[type]?.fields || []);
    reset();
  };

  const onSubmit = (data) => {
    if (formType === "paymentInformation") {
      const expiryDate = new Date(data.expiryDate);
      const today = new Date();
      if (expiryDate < today) {
        setError("expiryDate", {
          type: "manual",
          message: "Expiry date must be in the future.",
        });
        return;
      }
    }

    if (editIndex !== null) {
      const updatedData = [...submittedData[formType]];
      updatedData[editIndex] = data;
      setSubmittedData((prev) => ({
        ...prev,
        [formType]: updatedData,
      }));
      setEditIndex(null);
    } else {
      setSubmittedData((prev) => ({
        ...prev,
        [formType]: [...prev[formType], data],
      }));
    }
    reset();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const data = submittedData[formType][index];
    reset(data);
  };

  const handleDelete = (index) => {
    setSubmittedData((prev) => ({
      ...prev,
      [formType]: prev[formType].filter((_, i) => i !== index),
    }));
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: "700px",
        margin: "auto",
        background: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Dynamic Form Builder
      </Typography>

      <TextField
        select
        label="Select Form Type"
        value={formType}
        onChange={handleFormTypeChange}
        fullWidth
        sx={{ mb: 3 }}
      >
        <MenuItem value="userInformation">User Information</MenuItem>
        <MenuItem value="addressInformation">Address Information</MenuItem>
        <MenuItem value="paymentInformation">Payment Information</MenuItem>
      </TextField>

      {formFields.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              rules={{
                required: field.required ? "This field is required" : false,
                minLength: field.minLength ? { value: field.minLength, message: `Minimum length is ${field.minLength}` } : undefined,
                maxLength: field.maxLength ? { value: field.maxLength, message: `Maximum length is ${field.maxLength}` } : undefined,
                pattern: field.pattern ? { value: field.pattern, message: "Invalid format" } : undefined,
                min: field.min ? { value: field.min, message: `Minimum value is ${field.min}` } : undefined,
                max: field.max ? { value: field.max, message: `Maximum value is ${field.max}` } : undefined,
              }}
              render={({ field: controllerField }) => (
                <Box mb={2}>
                  <TextField
                    {...controllerField}
                    type={field.type}
                    label={field.label}
                    fullWidth
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message || ""}
                  />
                </Box>
              )}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {editIndex !== null ? "Update" : "Submit"}
          </Button>
        </form>
      )}

      {submittedData[formType]?.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {formType.replace("Information", " Details")}
          </Typography>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                {Object.keys(submittedData[formType][0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  >
                    {key}
                  </th>
                ))}
                <th style={{ backgroundColor: "#1976d2", color: "#fff" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submittedData[formType].map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td
                      key={i}
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {value}
                    </td>
                  ))}
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      <Box mt={4} textAlign="center">
        <Typography variant="body2" sx={{ color: "#555" }}>
          Made by Hrugved with ❤️
        </Typography>
      </Box>
    </Box>
  );
};

export default DynamicForm;
