import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Attribution, ScaleLine, defaults as defaultControl } from "ol/control";
import baseLayer from "./layers/base";
import railroadLayer from "./layers/rails";
import railsStyle from "./styles/railsStyle";

import { parseHash, setPermalink, setPopstate } from "./utils/handleHash";
import "./style.css";

const { zoom, center, rotation } = parseHash(window);

const map = new Map({
  target: "map",
  view: new View({
    center: center || fromLonLat([140.46, 36.37]),
    zoom: zoom || 12,
    rotation: rotation || 0,
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

setPermalink(map);
setPopstate(map, window);

const initialYear = "2017";
const sliderContainer = document.createElement("div");
sliderContainer.setAttribute("class", "slider-container");

const text = document.createElement("span");
text.setAttribute("class", "year");
text.textContent = initialYear;
sliderContainer.appendChild(text);

const slider = document.createElement("input");
slider.setAttribute("type", "range");
slider.setAttribute("class", "slider");
slider.setAttribute("min", "1950");
slider.setAttribute("max", "2017");
slider.setAttribute("value", initialYear);
sliderContainer.appendChild(slider);

slider.addEventListener("change", (event) => {
  const { value } = event.currentTarget as HTMLInputElement;

  railroadLayer.setStyle(railsStyle(parseInt(value, 10)));
  text.textContent = value;
});

document.body.appendChild(sliderContainer);
