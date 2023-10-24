import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVTFormat from "ol/format/MVT";

const railroadLayer = new VectorTileLayer({
  source: new VectorTileSource({
    url: "https://cieloazul310.github.io/mvt-tiles/tile/rails/{z}/{x}/{y}.mvt",
    format: new MVTFormat({
      layers: ["section", "station"],
    }),
    minZoom: 4,
    maxZoom: 15,
  }),
  declutter: true,
  className: "rails",
  style: null,
});

export default railroadLayer;
