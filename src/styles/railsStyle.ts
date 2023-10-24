import { FeatureLike } from "ol/Feature";
import stationStyle from "./stationStyle";
import sectionStyle from "./sectionStyle";
import { isStationProperties } from "../utils";
import type { RailsFeatureProperties, MapState } from "../types";

export default function railsStyle(state: MapState) {
  return (feature: FeatureLike, resolution: number) => {
    const station = stationStyle(state);
    const section = sectionStyle(state);

    const properties = feature.getProperties() as
      | RailsFeatureProperties<"section">
      | RailsFeatureProperties<"station">;

    if (isStationProperties(properties)) return station(properties, resolution);
    return section(properties, resolution);
  };
}
