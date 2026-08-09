import React from "react";
import { useNavigate } from "react-router-dom";
import { DynamicPropertyWizard } from "../../components/dynamic-property-wizard";
import { createProperty } from "../../services/backend-api";

export function NewPropertyPage() {
  const navigate = useNavigate();

  return (
    <DynamicPropertyWizard
      onClose={() => navigate("/owner/properties")}
      onSubmit={(property) => createProperty(property)}
    />
  );
}
