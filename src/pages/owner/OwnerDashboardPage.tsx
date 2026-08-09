import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { OwnerDashboard } from "../../components/owner-dashboard";
import { PropertyUploadWizard } from "../../components/property-upload-wizard";

export function OwnerDashboardPage() {
  const { properties, applications, handleCreateProperty } = useApp();
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="space-y-6">
      {isWizardOpen && (
        <PropertyUploadWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onPublish={(newProp) => {
            handleCreateProperty(newProp);
            setIsWizardOpen(false);
          }}
          onGoToDashboard={() => setIsWizardOpen(false)}
        />
      )}

      <OwnerDashboard
        properties={properties}
        applications={applications}
        onOpenUploadWizard={() => setIsWizardOpen(true)}
      />
    </div>
  );
}
