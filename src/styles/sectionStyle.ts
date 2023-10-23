import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import type { RailsFeatureProperties } from "../types";

export default function sectionStyle(year: number) {
  return (
    properties: RailsFeatureProperties<"section">,
    resolution: number,
  ) => {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { N05_005b, N05_005e } = properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10))
      return null;

    return new Style({
      stroke: new Stroke({ color: "#333", width: 2 }),
      zIndex: 9990,
    });
  };
}
