import Geol from "ol/geolocation";
import Feature from "ol/feature";
import Style from "ol/style/style";
import Circle from "ol/style/circle";
import Fill from "ol/style/fill";
import Stroke from "ol/style/stroke"
import PointGeom from "ol/geom/point";
import VectorLayer from "ol/layer/vector";
import VectorSource from "ol/source/vector";

export default (state) => {

    const geolocation = new Geol({
      projection: state.getMap().getView().getProjection()
    });

    const positionFeature = new Feature();
    positionFeature.setStyle([
      new Style({
        image: new Circle({
          radius: 12,
          fill: new Fill({
            color: 'rgba(51, 181, 204, 0.4)'
          })
        })
      }),
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({
            color: '#3399CC'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2
          })
        })
      })
    ]);

    const menus = document.querySelector(".menu-container ul.menus");
    const li = document.createElement("li");
    li.innerHTML = "現在地を表示";
    li.addEventListener("click", (evt) => {
      if (!geolocation.getTracking()) {
        geolocation.setTracking(true);
        evt.target.classList.add("active");
      } else {
        state.getMap().getView().setCenter(geolocation.getPosition());
      }
    });

    menus.appendChild(li);

    geolocation.once("change:position", () => {
      state.getMap().getView().setCenter(geolocation.getPosition());
      state.getMap().getView().setZoom(Math.max(12, state.getMap().getView().getZoom()));
      positionFeature.setGeometry(geolocation.getPosition() ?
        new PointGeom(geolocation.getPosition()) : null);
      new VectorLayer({
        map: state.getMap(),
        source: new VectorSource({
          features: [positionFeature]
        })
      });
    });

    geolocation.on('change:position', () => {
      positionFeature.setGeometry(geolocation.getPosition() ?
        new PointGeom(geolocation.getPosition()) : null);
    });

}
