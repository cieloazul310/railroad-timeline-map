import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Circle from "ol/style/Circle";
import { zoomToResolution } from "@cieloazul310/ol-gsi-vt";
import type { RailsFeatureProperties, MapState } from "../types";

export default function stationStyle({ year, selectedFeature }: MapState) {
  return (
    properties: RailsFeatureProperties<"station">,
    resolution: number,
  ) => {
    if (resolution > zoomToResolution(12)) return null;

    const { N05_005b, N05_005e, N05_011 } = properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10))
      return null;

    if (resolution > zoomToResolution(14)) {
      return new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 2 }),
        }),
        zIndex: 9998,
      });
    }

    const fontSize = resolution > zoomToResolution(15) ? "14px" : "16px";

    return [
      new Style({
        text: new Text({
          text: N05_011,
          font: `${fontSize} "Roboto, Helvetica, Arial, sans-serif"`,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 4 }),
          textAlign: "center",
          textBaseline: "bottom",
          offsetY: -10,
        }),
        zIndex: 9999,
      }),
      new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 2 }),
        }),
        zIndex: 9998,
      }),
    ];
  };
}
