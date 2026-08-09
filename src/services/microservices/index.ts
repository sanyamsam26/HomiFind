export * from "./auth-service";
export * from "./property-service";
export * from "./matching-service";
export * from "./visits-service";

export const MicroserviceGateway = {
  version: "v2.4.0",
  health: {
    authService: "HEALTHY",
    propertyService: "HEALTHY",
    matchingEngineService: "HEALTHY",
    visitSchedulingService: "HEALTHY",
    supabaseDatabaseCluster: "CONNECTED",
  }
};
