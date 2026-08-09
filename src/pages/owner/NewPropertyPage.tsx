import React from "react";
import { useNavigate } from "react-router-dom";
import { DynamicPropertyWizard } from "../../components/dynamic-property-wizard";
import { useApp } from "../../context/AppContext";

export function NewPropertyPage() {
  const navigate = useNavigate();
  const { handleCreateProperty } = useApp();

  const submitProperty = async (property: Parameters<typeof handleCreateProperty>[0]) => {
    const created = await handleCreateProperty(property);
    if (!created) throw new Error("Unable to create listing. Please try again.");
  };

  return (
    <DynamicPropertyWizard
      onClose={() => navigate("/owner/properties")}
      onSubmit={submitProperty}
    />
  );
}
