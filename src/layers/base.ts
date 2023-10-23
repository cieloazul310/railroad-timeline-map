import { gsiOptVtLayer, gsiOptVtLayerExclude } from "@cieloazul310/ol-gsi-vt";

const optVtLayer = gsiOptVtLayer({
  layers: gsiOptVtLayerExclude(["RailCL", "RailTrCL"]),
});

export default optVtLayer;
