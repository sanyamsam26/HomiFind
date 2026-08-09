import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { DynamicPropertyWizard } from "../../components/dynamic-property-wizard";

export function NewPropertyPage() {
  const { handleCreateProperty } = useApp();
  const navigate = useNavigate();

  return (
    <DynamicPropertyWizard
      onClose={() => navigate("/owner/properties")}
      onSubmit={async (property) => {
        await handleCreateProperty(property);
      }}
    />
  );
}
