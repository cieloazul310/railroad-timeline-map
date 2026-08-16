import type { FeatureLike } from "ol/Feature";
import type { MapState, RailsFeatureProperties } from "../types";
import { isStationProperties } from "../utils";
import sectionStyle from "./sectionStyle";
import stationStyle from "./stationStyle";

export default function railsStyle(state: MapState) {
  return (feature: FeatureLike, resolution: number) => {
    const station = stationStyle(state);
    const section = sectionStyle(state);

    const properties = feature.getProperties() as
      RailsFeatureProperties<"section"> | RailsFeatureProperties<"station">;

    if (isStationProperties(properties)) return station(properties, resolution);
    return section(properties, resolution);
  };
}
