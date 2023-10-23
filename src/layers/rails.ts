import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVTFormat from "ol/format/MVT";
import railsStyle from "../styles/railsStyle";

const railroadLayer = new VectorTileLayer({
  source: new VectorTileSource({
    url: "https://cieloazul310.github.io/mvt-tiles/tile/rails/{z}/{x}/{y}.mvt",
    format: new MVTFormat({
      layers: ["section", "station"],
    }),
  }),
  declutter: true,
  style: railsStyle(1960),
});

export default railroadLayer;
