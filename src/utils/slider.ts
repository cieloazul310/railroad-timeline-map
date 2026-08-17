import type { MapState } from "../types";

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

  const yearText = document.createElement("label");
  yearText.className = "year";
  yearText.innerText = state.year.toString();
  yearText.setAttribute("for", "year-slider");
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
    button.setAttribute("for", "year-slider");
    button.innerText = label;
    return button;
  });

  const slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.className = "slider";
  slider.id = "year-slider";
  slider.setAttribute("aria-label", "表示年スライダー");
  slider.setAttribute("min", extent.min.toString());
  slider.setAttribute("aria-value-min", extent.min.toString());
  slider.setAttribute("max", extent.max.toString());
  slider.setAttribute("aria-value-max", extent.max.toString());
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
