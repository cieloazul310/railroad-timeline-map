import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { zoomToResolution } from "@cieloazul310/ol-gsi-vt";
import type { RailsFeatureProperties, MapState } from "../types";

const selectedSection = (width: number) => [
  new Style({
    stroke: new Stroke({
      color: "#ff0",
      width,
    }),
    zIndex: 971,
  }),
  new Style({
    stroke: new Stroke({ color: "#000", width: width * 2 }),
    zIndex: 970,
  }),
];

const shinkansen = (selected: boolean) =>
  selected
    ? selectedSection(5)
    : [
        new Style({
          stroke: new Stroke({
            color: "#eee",
            width: 3,
            lineCap: "butt",
            lineDash: [12, 12],
          }),
          zIndex: 955,
        }),
        new Style({
          stroke: new Stroke({ color: "#33f", width: 6 }),
          zIndex: 954,
        }),
      ];

const jrStyle = (selected: boolean) =>
  selected
    ? selectedSection(3)
    : [
        new Style({
          stroke: new Stroke({
            color: "#eee",
            width: 2,
            lineCap: "butt",
            lineDash: [8, 8],
          }),
          zIndex: 953,
        }),
        new Style({
          stroke: new Stroke({ color: "#55a", width: 4 }),
          zIndex: 952,
        }),
      ];

export default function sectionStyle({ year, selectedFeature }: MapState) {
  return (
    properties: RailsFeatureProperties<"section">,
    resolution: number,
  ) => {
    const { N05_001, N05_002, N05_005b, N05_005e, N05_006 } = properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10) + 1)
      return null;
    const selected =
      N05_002 === selectedFeature?.N05_002 ||
      N05_006 === selectedFeature?.N05_006;

    if (!selected && resolution > zoomToResolution(8))
      return new Style({
        stroke: new Stroke({
          width: 1,
          color: "#555",
        }),
      });

    if (N05_001 === "1") return shinkansen(selected);
    if (N05_001 === "2") return jrStyle(selected);

    const strokeWidth = N05_001 === "4" ? 3 : 2;

    return selected
      ? selectedSection(strokeWidth + 1)
      : [
          new Style({
            stroke: new Stroke({ color: "#865", width: strokeWidth }),
            zIndex: 951,
          }),
          new Style({
            stroke: new Stroke({ color: "#fff", width: strokeWidth * 2 }),
            zIndex: 950,
          }),
        ];
  };
}
