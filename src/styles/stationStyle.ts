import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Circle from "ol/style/Circle";
import type { RailsFeatureProperties } from "../types";

export default function stationStyle(year: number) {
  return (
    properties: RailsFeatureProperties<"station">,
    resolution: number,
  ) => {
    const { N05_005b, N05_005e, N05_011 } = properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10))
      return null;

    return [
      new Style({
        text: new Text({
          text: N05_011,
          font: "18px sans-serif",
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 4 }),
          textAlign: "center",
          textBaseline: "bottom",
          offsetY: -12,
        }),
        zIndex: 9999,
      }),
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 2 }),
        }),
        zIndex: 9998,
      }),
    ];
  };
}
