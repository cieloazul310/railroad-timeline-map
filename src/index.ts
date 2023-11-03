import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Attribution, ScaleLine, defaults as defaultControl } from "ol/control";
import Link from "ol/interaction/Link";
import Geolocation from "ol/Geolocation";
import baseLayer from "./layers/base";
import railroadLayer from "./layers/rails";
import railsStyle from "./styles/railsStyle";
import {
  useGeolocation,
  GeolocationControl,
  createSlider,
  createInfo,
} from "./utils";
import type { RailsFeatureProperties, MapState } from "./types";
import "./style.css";

const extent = {
  min: 1950,
  max: 2017,
};
const url = new URL(window.location.href);
const params = url.searchParams;
const initialYear = params.get("year");

const state: MapState = {
  year: initialYear
    ? Math.max(extent.min, Math.min(parseInt(initialYear, 10), extent.max))
    : extent.max,
};

const geolocation = new Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
});

const geolocationControl = new GeolocationControl();
const { sliderContainer, yearText, buttons, slider } = createSlider({
  state,
  extent,
});
document.body.appendChild(sliderContainer);
const { infoContainer, railTitle, railDescription } = createInfo();
document.body.appendChild(infoContainer);

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
    geolocationControl,
  ]),
});

map.addInteraction(
  new Link({
    params: ["x", "y", "z"],
    replace: true,
  }),
);

map.once("loadend", () => {
  railroadLayer.setStyle(railsStyle({ year: state.year }));
});

geolocationControl.setGeolocation(geolocation);
useGeolocation({ map, geolocation });

function getSectionInExtent(clickedN05_002?: string | null) {
  const features = railroadLayer
    .getSource()
    .getFeaturesInExtent(map.getView().getViewStateAndExtent().extent)
    .filter((feature) => {
      const { N05_002, N05_005b, N05_005e, layer } = feature.getProperties() as
        | RailsFeatureProperties<"section">
        | RailsFeatureProperties<"station">;
      return (
        layer === "section" &&
        N05_002 === clickedN05_002 &&
        state.year >= parseInt(N05_005b, 10) &&
        state.year <= parseInt(N05_005e, 10)
      );
    });

  if (!features.length) return undefined;

  return features[0].getProperties() as RailsFeatureProperties<"section">;
}

function setSelectedFeature(
  newProps: Partial<
    Pick<RailsFeatureProperties<"section">, "N05_002" | "N05_003" | "N05_006">
  >,
) {
  state.selectedFeature = { ...state.selectedFeature, ...newProps };
  railTitle.innerText = state.selectedFeature?.N05_002;
  railDescription.innerText = state.selectedFeature.N05_003;

  railroadLayer.setStyle(railsStyle(state));
}

function setYear(year: number) {
  state.year = year;
  railroadLayer.setStyle(railsStyle(state));
  yearText.innerText = state.year.toString();
  if (!params.get("year")) {
    params.append("year", state.year.toString());
  } else {
    params.set("year", state.year.toString());
  }
  window.history.replaceState(null, "", url);

  /** 運営会社名が変わった場合、選択した路線の情報をアップデート */
  const section = getSectionInExtent(state.selectedFeature?.N05_002);
  if (section) {
    const { N05_002, N05_003, N05_006 } = section;
    setSelectedFeature({ N05_002, N05_003, N05_006 });
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.year;
    const newValue = Math.min(
      extent.max,
      Math.max(state.year + parseInt(value, 10), extent.min),
    );
    setYear(newValue);

    if (slider.value !== newValue.toString()) {
      slider.value = newValue.toString();
    }
  });
});

slider.addEventListener("change", (event) => {
  const { value } = event.currentTarget as HTMLInputElement;
  setYear(parseInt(value, 10));
});

map.on("singleclick", (event) => {
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
    railTitle.innerText = "";
    railDescription.innerText = "";
    return;
  }
  const { N05_002, layer } = feature.getProperties() as
    | RailsFeatureProperties<"section">
    | RailsFeatureProperties<"station">;

  if (layer === "section") {
    const { N05_003, N05_006 } =
      feature.getProperties() as RailsFeatureProperties<"section">;
    setSelectedFeature({ N05_002, N05_003, N05_006 });
  } else {
    /** クリックした地物が駅の場合、路線を検索し置き換え */
    const section = getSectionInExtent(N05_002);
    if (section) {
      const { N05_003, N05_006 } = section;
      setSelectedFeature({ N05_002, N05_003, N05_006 });
    }
  }
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
