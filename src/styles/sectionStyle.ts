import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import type { RailsFeatureProperties, MapState } from "../types";

const selectedSection = (width: number) => [
  new Style({
    stroke: new Stroke({
      color: "#ff0",
      width,
    }),
    zIndex: 9998,
  }),
  new Style({
    stroke: new Stroke({ color: "#000", width: width * 2 }),
    zIndex: 9997,
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
          zIndex: 9996,
        }),
        new Style({
          stroke: new Stroke({ color: "#33f", width: 6 }),
          zIndex: 9995,
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
          zIndex: 9994,
        }),
        new Style({
          stroke: new Stroke({ color: "#555", width: 4 }),
          zIndex: 9993,
        }),
      ];

export default function sectionStyle({ year, selectedFeature }: MapState) {
  return (
    properties: RailsFeatureProperties<"section">,
    resolution: number,
  ) => {
    const { N05_001, N05_005b, N05_005e, N05_006 } = properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10))
      return null;
    const selected = N05_006 === selectedFeature?.N05_006;

    if (N05_001 === "1") return shinkansen(selected);
    if (N05_001 === "2") return jrStyle(selected);

    return selected
      ? selectedSection(3)
      : [
          new Style({
            stroke: new Stroke({ color: "#333", width: 2 }),
            zIndex: 9991,
          }),
          new Style({
            stroke: new Stroke({ color: "#fff", width: 4 }),
            zIndex: 9990,
          }),
        ];
  };
}
