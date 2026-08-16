import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

export default function useGeolocation({
  map,
  geolocation,
}: {
  map: Map;
  geolocation: Geolocation;
}) {
  geolocation.setProjection(map.getView().getProjection());

  // handle geolocation error.
  geolocation.once("error", (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    window.alert(`現在地を取得できません。`);
  });

  const accuracyFeature = new Feature();
  geolocation.on("change:accuracyGeometry", () => {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry() ?? undefined);
  });

  const positionFeature = new Feature();
  positionFeature.setStyle(
    new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: "#3399CC",
        }),
        stroke: new Stroke({
          color: "#fff",
          width: 2,
        }),
      }),
    }),
  );

  geolocation.on("change:position", () => {
    const coordinates = geolocation.getPosition();
    positionFeature.setGeometry(
      coordinates ? new Point(coordinates) : undefined,
    );
  });

  const vector = new VectorLayer({
    source: new VectorSource({
      features: [accuracyFeature, positionFeature],
    }),
  });
  map.addLayer(vector);

  geolocation.on("change:tracking", () => {
    vector.setVisible(geolocation.getTracking());
    if (geolocation.getTracking()) {
      geolocation.once("change:position", () => {
        const position = geolocation.getPosition();
        if (position) {
          map.getView().animate({
            center: position,
            zoom: Math.max(15, map.getView().getZoom() ?? 15),
            duration: 250,
          });
        }
      });
    }
  });
}
