import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Attribution, ScaleLine, defaults as defaultControl } from "ol/control";
import Link from "ol/interaction/Link";
import { defaultPalette } from "@cieloazul310/ol-gsi-vt";
import baseLayer from "./layers/base";
import railroadLayer from "./layers/rails";
import railsStyle from "./styles/railsStyle";

import type { RailsFeatureProperties, MapState } from "./types";
import "./style.css";

const map = new Map({
  target: "map",
  view: new View({
    center: fromLonLat([140.46, 36.37]),
    zoom: 12,
    rotation: 0,
    enableRotation: false,
  }),
  layers: [baseLayer, railroadLayer],
  controls: defaultControl({
    attribution: false,
  }).extend([
    new Attribution({
      collapsible: false,
    }),
    new ScaleLine(),
  ]),
});

const state: MapState = {
  year: 2017,
};

map.addInteraction(
  new Link({
    params: ["x", "y", "z"],
  }),
);

map.once("loadend", () => {
  railroadLayer.setStyle(railsStyle({ year: state.year }));
});

map.getView().on("change:resolution", (event) => {
  event.preventDefault();
  if (map.getView().getZoom() < 9) {
    baseLayer.setBackground(defaultPalette.waterarea);
  } else {
    baseLayer.setBackground(null);
  }
});

const sliderContainer = document.createElement("div");
sliderContainer.setAttribute("class", "slider-container");

const text = document.createElement("span");
text.setAttribute("class", "year");
text.innerText = state.year.toString();
sliderContainer.appendChild(text);

const slider = document.createElement("input");
slider.setAttribute("type", "range");
slider.setAttribute("class", "slider");
slider.setAttribute("min", "1950");
slider.setAttribute("max", "2017");
slider.setAttribute("value", state.year.toString());
sliderContainer.appendChild(slider);

document.body.appendChild(sliderContainer);

const infoContainer = document.createElement("article");
infoContainer.setAttribute("class", "info-container");
const info = document.createElement("hgroup");
info.setAttribute("class", "info");
const railTitle = document.createElement("h1");
const railDescription = document.createElement("p");
info.appendChild(railTitle);
info.appendChild(railDescription);

infoContainer.appendChild(info);
document.body.appendChild(infoContainer);

slider.addEventListener("change", (event) => {
  const { value } = event.currentTarget as HTMLInputElement;
  state.year = parseInt(value, 10);

  railroadLayer.setStyle(railsStyle(state));
  text.innerText = state.year.toString();

  const features = railroadLayer
    .getSource()
    .getFeaturesInExtent(map.getView().getViewStateAndExtent().extent)
    .filter((feature) => {
      const { N05_005b, N05_005e, N05_006 } = feature.getProperties() as
        | RailsFeatureProperties<"section">
        | RailsFeatureProperties<"station">;
      return (
        N05_006 === state.selectedFeature?.N05_006 &&
        state.year >= parseInt(N05_005b, 10) &&
        state.year <= parseInt(N05_005e, 10)
      );
    });
  if (features.length) {
    const { N05_002, N05_003 } = features[0].getProperties() as
      | RailsFeatureProperties<"section">
      | RailsFeatureProperties<"station">;
    railTitle.innerText = N05_002;
    railDescription.innerText = N05_003;
  }
});

map.on("click", (event) => {
  const feature = map.forEachFeatureAtPixel(
    event.pixel,
    (featureLike) => featureLike,
    {
      layerFilter: (layer) => layer.getClassName() === "rails",
      hitTolerance: 4,
    },
  );
  if (!feature) {
    state.selectedFeature = null;
    railroadLayer.setStyle(railsStyle(state));
    return;
  }
  const { N05_002, N05_003, N05_006 } = feature.getProperties() as
    | RailsFeatureProperties<"section">
    | RailsFeatureProperties<"station">;

  state.selectedFeature = { N05_002, N05_003, N05_006 };
  railTitle.innerText = state.selectedFeature?.N05_002;
  railDescription.innerText = state.selectedFeature.N05_003;

  railroadLayer.setStyle(railsStyle(state));
});

map.on("pointermove", (event) => {
  event.preventDefault();
  const feature = map.forEachFeatureAtPixel(
    event.pixel,
    (featureLike) => featureLike,
    {
      layerFilter: (layer) => layer.getClassName() === "rails",
      hitTolerance: 4,
    },
  );
  if (!feature) {
    if (state.selectedFeature) {
      railTitle.innerText = state.selectedFeature.N05_002;
      railDescription.innerText = state.selectedFeature.N05_003;
    } else {
      railTitle.innerText = "";
      railDescription.innerText = "";
    }
    return;
  }

  const { N05_002, N05_003 } = feature.getProperties() as
    | RailsFeatureProperties<"section">
    | RailsFeatureProperties<"station">;

  railTitle.innerText = N05_002;
  railDescription.innerText = N05_003;
});
