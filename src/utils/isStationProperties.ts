import type { RailsFeatureProperties } from "../types";

const has = Object.prototype.hasOwnProperty;

export default function isStationProperties(
  properties:
    | RailsFeatureProperties<"section">
    | RailsFeatureProperties<"station">,
): properties is RailsFeatureProperties<"station"> {
  return has.call(properties, "N05_011");
}
