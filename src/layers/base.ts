import {
  gsiOptVtPaleLayer,
  gsiOptVtLayerExclude,
  type GsiOptVTFeatureProperties,
} from "@cieloazul310/ol-gsi-vt";
import Style from "ol/style/Style";

const vtLayer = gsiOptVtPaleLayer({
  layers: gsiOptVtLayerExclude(["RailCL", "RailTrCL"]),
  styles: {
    Anno: (feature) => {
      const { vt_code } = feature.getProperties() as GsiOptVTFeatureProperties;

      if (vt_code === 422) return new Style();

      return undefined;
    },
  },
});

export default vtLayer;
