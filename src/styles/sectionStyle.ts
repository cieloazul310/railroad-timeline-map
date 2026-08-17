import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import type { MapState, RailsFeatureProperties } from "../types";

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

const jrStyle = ({
  width,
  color,
  zIndex,
}: {
  width: number;
  color: string;
  zIndex: number;
}) => [
  new Style({
    stroke: new Stroke({
      color: "#eee",
      width: width / 2,
      lineCap: "butt",
      lineDash: [width * 2, width * 2],
    }),
    zIndex: zIndex + 1,
  }),
  new Style({
    stroke: new Stroke({ color, width }),
    zIndex: zIndex,
  }),
];

export default function sectionStyle({ year, selectedFeature }: MapState) {
  return (
    properties: RailsFeatureProperties<"section">,
    // resolution: number,
  ) => {
    const { N05_001, N05_002, N05_003, N05_005b, N05_005e, N05_006 } =
      properties;
    if (year < parseInt(N05_005b, 10) || year > parseInt(N05_005e, 10) + 1)
      return null;

    if (!selectedFeature) {
      if (N05_001 === "1")
        return jrStyle({ width: 6, color: colors.shinkansen, zIndex: 954 });
      if (N05_001 === "2")
        return jrStyle({ width: 4, color: colors.jr, zIndex: 952 });
      const styles = (() => {
        if (N05_001 === "4") return { color: "#c57", width: 3 };
        if (N05_001 === "5") return { color: "#ca5", width: 2 };
        return { color: "#cc5", width: 2 };
      })();
      return [
        new Style({
          stroke: new Stroke(styles),
          zIndex: 951,
        }),
        new Style({
          stroke: new Stroke({
            color: "#fff",
            width: styles.width * 2,
          }),
          zIndex: 950,
        }),
      ];
    }

    const isSelected =
      (N05_002 === selectedFeature?.N05_002 &&
        N05_003 === selectedFeature?.N05_003) ||
      N05_006 === selectedFeature?.N05_006;

    const isSameCompany = N05_003 === selectedFeature?.N05_003;

    if (!isSelected && !isSameCompany) {
      if (N05_001 === "1")
        return jrStyle({ width: 6, color: "#333", zIndex: 954 });
      if (N05_001 === "2")
        return jrStyle({ width: 4, color: "#666", zIndex: 952 });
      const width = (() => {
        if (N05_001 === "4") return 3;
        return 2;
      })();

      return [
        new Style({
          stroke: new Stroke({ width, color: "#999" }),
          zIndex: 951,
        }),
        new Style({
          stroke: new Stroke({
            color: "#fff",
            width: width * 2,
          }),
          zIndex: 950,
        }),
      ];
    }

    if (N05_001 === "1")
      return jrStyle({
        width: isSelected ? 8 : 4,
        color: colors.shinkansen,
        zIndex: isSelected ? 999 : 997,
      });
    if (N05_001 === "2")
      return jrStyle({
        width: isSelected ? 6 : 3,
        color: colors.jr,
        zIndex: isSelected ? 999 : 997,
      });

    const styles = (() => {
      if (N05_001 === "4") return { color: "#c57", width: 3 };
      if (N05_001 === "5") return { color: "#ca5", width: 2 };
      return { color: "#cc5", width: 2 };
    })();

    return isSelected
      ? selectedSection({ width: styles.width * 1.5, color: styles.color })
      : [
          new Style({
            stroke: new Stroke(styles),
            zIndex: isSameCompany ? 969 : 950,
          }),
          new Style({
            stroke: new Stroke({
              color: isSameCompany ? "#666" : "#fff",
              width: styles.width * 2,
            }),
            zIndex: isSameCompany ? 967 : 950,
          }),
        ];
  };
}
