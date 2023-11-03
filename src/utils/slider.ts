import { MapState } from "../types";

function createSlider({
  state,
  extent,
}: {
  state: MapState;
  extent: {
    min: number;
    max: number;
  };
}) {
  const sliderContainer = document.createElement("div");
  sliderContainer.className = "slider-container";

  const yearText = document.createElement("span");
  yearText.className = "year";
  yearText.innerText = state.year.toString();
  sliderContainer.appendChild(yearText);

  const yearHandler = document.createElement("div");
  yearHandler.className = "year-handler";

  const buttons = [
    { value: -5, label: "-5" },
    { value: -1, label: "-" },
    { value: 1, label: "+" },
    { value: 5, label: "+5" },
  ].map(({ value, label }) => {
    const button = document.createElement("button");
    button.className = "year-handler-button ol-unselectable";
    button.setAttribute("data-year", value.toString());
    button.innerText = label;
    return button;
  });

  const slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.className = "slider";
  slider.setAttribute("min", extent.min.toString());
  slider.setAttribute("max", extent.max.toString());
  slider.setAttribute("value", state.year.toString());

  yearHandler.appendChild(buttons[0]);
  yearHandler.appendChild(buttons[1]);
  yearHandler.appendChild(slider);
  yearHandler.appendChild(buttons[2]);
  yearHandler.appendChild(buttons[3]);
  sliderContainer.appendChild(yearHandler);

  return { sliderContainer, yearText, yearHandler, buttons, slider };
}

export default createSlider;
