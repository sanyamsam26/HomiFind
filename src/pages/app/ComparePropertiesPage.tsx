import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PropertyComparisonView } from "../../components/property-comparison-view";

export function ComparePropertiesPage() {
  const { properties } = useApp();
  const navigate = useNavigate();

  const propertyA = properties[0];
  const propertyB = properties[1] || properties[0];

  return (
    <PropertyComparisonView
      propertyA={propertyA}
      propertyB={propertyB}
      onClose={() => navigate("/app/explore")}
      onSelectWinner={(p) => navigate(`/app/properties/${p.id}`)}
    />
  );
}
