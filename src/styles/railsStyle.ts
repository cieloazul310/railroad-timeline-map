import { FeatureLike } from "ol/Feature";
import stationStyle from "./stationStyle";
import sectionStyle from "./sectionStyle";
import type { RailsFeatureProperties } from "../types";

const has = Object.prototype.hasOwnProperty;

function isStationProperties(
  properties:
    | RailsFeatureProperties<"section">
    | RailsFeatureProperties<"station">,
): properties is RailsFeatureProperties<"station"> {
  return has.call(properties, "N05_011");
}

export default function railsStyle(year: number) {
  return (feature: FeatureLike, resolution: number) => {
    const station = stationStyle(year);
    const section = sectionStyle(year);

    const properties = feature.getProperties() as
      | RailsFeatureProperties<"section">
      | RailsFeatureProperties<"station">;

    if (isStationProperties(properties)) return station(properties, resolution);
    return section(properties, resolution);
  };
}
