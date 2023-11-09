import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import type { RailsFeatureProperties, MapState } from "../types";

const colors = {
  shinkansen: "#33f",
  jr: "#55a",
  shitetsu: "#c57",
  municipal: "#cc5",
  third_sector: "#ca5",
};

const selectedSection = ({
  width,
  color,
}: {
  width: number;
  color: string;
}) => [
  new Style({
    stroke: new Stroke({
      color,
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
    ? selectedSection({ width: 5, color: colors.shinkansen })
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
          stroke: new Stroke({ color: colors.shinkansen, width: 6 }),
          zIndex: 954,
        }),
      ];

const jrStyle = (selected: boolean) =>
  selected
    ? selectedSection({ width: 3, color: colors.jr })
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
          stroke: new Stroke({ color: colors.jr, width: 4 }),
          zIndex: 952,
        }),
      ];

export default function sectionStyle({ year, selectedFeature }: MapState) {
  return (
    properties: RailsFeatureProperties<"section">,
    resolution: number,
  ) => {
    const { N05_001, N05_002, N05_003, N05_005b, N05_005e, N05_006 } =
      properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10) + 1)
      return null;
    const selected =
      (N05_002 === selectedFeature?.N05_002 &&
        N05_003 === selectedFeature?.N05_003) ||
      N05_006 === selectedFeature?.N05_006;

    const sameCompony = N05_003 === selectedFeature?.N05_003;

    if (N05_001 === "1") return shinkansen(selected);
    if (N05_001 === "2") return jrStyle(selected);

    const styles = (() => {
      if (N05_001 === "4") return { color: "#c57", width: 3 };
      if (N05_001 === "5") return { color: "#ca5", width: 2 };
      return { color: "#cc5", width: 2 };
    })();

    return selected
      ? selectedSection({ width: styles.width * 1.5, color: styles.color })
      : [
          new Style({
            stroke: new Stroke(styles),
            zIndex: 951,
          }),
          new Style({
            stroke: new Stroke({
              color: sameCompony ? "#666" : "#fff",
              width: styles.width * 2,
            }),
            zIndex: 950,
          }),
        ];
  };
}
