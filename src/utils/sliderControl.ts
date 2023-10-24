import Control, { type Options as ControlOptions } from "ol/control/Control";
import { MapState } from "../types";

interface SliderControlOptions extends ControlOptions {
  state: MapState;
  extent: {
    min: number;
    max: number;
  };
}

class SliderControl extends Control {
  private extent: {
    min: number;
    max: number;
  };

  private setYear: (year: number) => void;

  private state: MapState;

  constructor(opt_options: SliderControlOptions) {
    const options = opt_options ?? {};

    const element = document.createElement("div");
    element.className = "slider-container ol-unselectable ol-control";

    const text = document.createElement("span");
    text.setAttribute("class", "year");
    element.appendChild(text);
    const yearHandler = document.createElement("div");
    yearHandler.setAttribute("class", "year-handler");

    const buttons = [
      { value: -5, label: "<<" },
      { value: -1, label: "<" },
      { value: 1, label: ">" },
      { value: 5, label: ">>" },
    ].map(({ value, label }) => {
      const button = document.createElement("button");
      button.setAttribute("class", "year-handler-button");
      button.setAttribute("data-year", value.toString());
      button.innerText = label;
      return button;
    });

    const slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("class", "slider");

    yearHandler.appendChild(buttons[0]);
    yearHandler.appendChild(buttons[1]);
    yearHandler.appendChild(slider);
    yearHandler.appendChild(buttons[2]);
    yearHandler.appendChild(buttons[3]);
    element.appendChild(yearHandler);

    super({
      element,
      // @ts-expect-error
      target: options.target,
    });
    this.state = opt_options.state;
    this.extent = opt_options.extent;

    text.innerText = this.state.year.toString();
    slider.setAttribute("min", this.extent.min.toString());
    slider.setAttribute("max", this.extent.max.toString());
    slider.setAttribute("value", this.state.year.toString());

    slider.addEventListener("change", (event) => {
      const { value } = event.currentTarget as HTMLInputElement;
      this.setYear(parseInt(value, 10));
    });
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.year;
        const newValue = Math.min(
          this.extent.max,
          Math.max(this.state.year + parseInt(value, 10), this.extent.min),
        );
        this.setYear(newValue);

        if (slider.value !== newValue.toString()) {
          slider.value = newValue.toString();
        }
      });
    });
  }

  public setText(year: string) {
    this.element.querySelector(".year").innerHTML = year;
  }

  public setYearFunction(func: (year: number) => void) {
    this.setYear = func;
  }
}

export default SliderControl;
