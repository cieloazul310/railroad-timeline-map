import {
  gsiOptVtStyle,
  palePalette,
  gsiOptVtLayerExclude,
  type GsiOptVTFeatureProperties,
} from "@cieloazul310/ol-gsi-vt";
import VectorTileLayer from "ol/layer/VectorTile";
import Style from "ol/style/Style";
import PMTilesVectorSource from "../utils/ol-pmtiles";

const vtLayer = new VectorTileLayer({
  declutter: true,
  source: new PMTilesVectorSource({
    url: "https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/optimal_bvmap-v1.pmtiles",
    attributions: ["国土地理院"],
    mvtFormatOptions: {
      layers: gsiOptVtLayerExclude(["RailCL", "RailTrCL"]),
    },
  }),
  style: gsiOptVtStyle({
    theme: {
      palette: palePalette,
    },
    styles: {
      Anno: (feature) => {
        const { vt_code } =
          feature.getProperties() as GsiOptVTFeatureProperties;

        if (vt_code === 422) return new Style();

        return undefined;
      },
    },
  }),
});

export default vtLayer;
