// Central icon compatibility layer.
// HomiFind uses Lucide as its single icon system. The generated UI once
// referenced an `Elevator` icon that is not part of the installed Lucide set;
// keep that legacy name mapped to an existing icon until the screen is
// redesigned with the final property-amenity iconography.
export * from "lucide-react/dist/esm/lucide-react.js";
export { Building2 as Elevator } from "lucide-react/dist/esm/lucide-react.js";
