import { gsiOptVtStyle, gsiOptVtLayerExclude } from "@cieloazul310/ol-gsi-vt";
import VectorTileLayer from "ol/layer/VectorTile";
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
  style: gsiOptVtStyle(),
});

export default vtLayer;
