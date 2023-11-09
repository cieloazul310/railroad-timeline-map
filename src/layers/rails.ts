import VectorTileLayer from "ol/layer/VectorTile";
import { PMTilesVectorSource } from "ol-pmtiles";

const railroadLayer = new VectorTileLayer({
  source: new PMTilesVectorSource({
    url: import.meta.env.VITE_TILE_URL,
    attributions:
      '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N05-v2_0.html" target="_blank" rel="noreferrer noopener">国土数値情報(鉄道時系列)</a>',
    minZoom: 4,
    maxZoom: 15,
  }),
  declutter: true,
  className: "rails",
  style: null,
});

export default railroadLayer;
