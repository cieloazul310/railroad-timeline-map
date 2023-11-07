import VectorTileLayer from "ol/layer/VectorTile";
import { PMTilesVectorSource } from "ol-pmtiles";

const railroadLayer = new VectorTileLayer({
  source: new PMTilesVectorSource({
    url: "https://cieloazul310.github.io/ksj-vt/N05-22.pmtiles",
    attributions: "国土数値情報(鉄道時系列)",
    minZoom: 4,
    maxZoom: 15,
  }),
  declutter: true,
  className: "rails",
  style: null,
});

export default railroadLayer;
