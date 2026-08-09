import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PropertyUploadWizard } from "../../components/property-upload-wizard";

export function NewPropertyPage() {
  const { handleCreateProperty } = useApp();
  const navigate = useNavigate();

  return (
    <PropertyUploadWizard
      isOpen={true}
      onClose={() => navigate("/owner/properties")}
      onPublish={(newProp) => {
        handleCreateProperty(newProp);
        navigate("/owner/properties");
      }}
      onGoToDashboard={() => navigate("/owner/dashboard")}
    />
  );
}
