import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Circle from "ol/style/Circle";
import { zoomToResolution, defaultPalette } from "@cieloazul310/ol-gsi-vt";
import type { RailsFeatureProperties, MapState } from "../types";

export default function stationStyle({ year, selectedFeature }: MapState) {
  return (
    properties: RailsFeatureProperties<"station">,
    resolution: number,
  ) => {
    const { N05_002, N05_005b, N05_005e, N05_011 } = properties;
    const selected = selectedFeature?.N05_002 === N05_002;

    if (resolution > zoomToResolution(12) && !selected) return null;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10))
      return null;

    if (resolution > zoomToResolution(14) && !selected) {
      return new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 2 }),
        }),
        zIndex: 960,
      });
    }

    const fontSize = (() => {
      if (resolution > zoomToResolution(15)) {
        return selected ? "18px" : "14px";
      }
      return selected ? "20px" : "16px";
    })();

    return [
      new Style({
        text: new Text({
          text: N05_011,
          font: `${fontSize} "Roboto, Helvetica, Arial, sans-serif"`,
          fill: new Fill({
            color:
              !selectedFeature || selected
                ? defaultPalette.anno.transp
                : "#777",
          }),
          stroke: new Stroke({
            color: "white",
            width: 4,
          }),
          textAlign: "center",
          textBaseline: "bottom",
          offsetY: -10,
        }),
        zIndex: 965 + (selected ? 10 : 0),
      }),
      new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 2 }),
        }),
        zIndex: 960,
      }),
    ];
  };
}
