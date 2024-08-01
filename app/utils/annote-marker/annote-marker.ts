import { IconDotCircle } from "@codexteam/icons";
import "./style.css";

export interface AnnoteMarkerData {
  text: string;
}

export interface AnnoteMarkerConfig {
  placeholder?: string;
  // TODO: We may want to implement these, or not.
  onMarkerCreate?: (data: string) => void;
  onMarkerRemove?: (data: string) => void;
}

interface PalletData {
  label: string;
  colorHex: string;
  rgba: string;
}

export default class AnnoteMarker {
  private _api: { [key in string]: any };
  private _button: HTMLElement | null;
  private _tag: string;

  private _currentRange: Range | null = null;
  private _termWrapper: any = null;

  private _data: AnnoteMarkerData;
  private _config: AnnoteMarkerConfig;

  private _unwrapping: boolean = false;

  // This is for future reference for the colors we can use based on the figma design
  private readonly _pallet: PalletData[] = [
    {
      label: "blue",
      colorHex: "#0084C3",
      rgba: "rgba(0, 132, 195, 0.29)",
    },
    {
      label: "pink",
      colorHex: "#F1607D",
      rgba: "rgba(241, 96, 125, 0.29)",
    },
    {
      label: "red",
      colorHex: "#F64C00",
      rgba: "rgba(246, 76, 0, 0.29)",
    },
    {
      label: "gold",
      colorHex: "#CEA000",
      rgba: "rgba(206, 160, 0, 0.29)",
    },
    {
      label: "green",
      colorHex: "#02A856",
      rgba: "rgba(2, 168, 86, 0.29)",
    },
    {
      label: "teal",
      colorHex: "#03A58D",
      rgba: "rgba(3, 165, 141, 0.29)",
    },
    {
      label: "purple",
      colorHex: "#821EB1",
      rgba: "	rgba(130, 30, 177, 0.29)",
    },
  ];

  private iconClasses: {
    base: string;
    active: string;
  };

  constructor({
    data,
    api,
    readOnly,
    config,
  }: {
    data: any;
    api: Object;
    readOnly: boolean;
    config: AnnoteMarkerConfig;
  }) {
    this._api = api;
    this._button = null;
    this._tag = "MARK"; // THIS WAS MARK, set it to AMARK to avoid conflict with the default mark tag?
    this._data = data;
    this._config = config;

    // CSS Classes
    this.iconClasses = {
      base: this._api.styles.inlineToolButton,
      active: this._api.styles.inlineToolButtonActive,
    };
  }
  static get CSS() {
    return "cdx-marker";
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get getPinCSS() {
    return "pin";
  }

  private getPinNumbers(): number[] {
    let pins = document.getElementsByClassName(AnnoteMarker.CSS) as any;
    let pinNumbers: number[] = [];
    for (let i = 0; i < pins.length; i++) {
      pinNumbers.push(parseInt(pins[i].dataset.pin!));
    }
    return pinNumbers;
  }

  // Specifies tool as an inline toolbar tool
  public static get isInline() {
    return true;
  }

  // Create toolbar button element
  public render() {
    let mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    let pickerToolBarContainer = document.createElement("div");
    pickerToolBarContainer.classList.add("picker-toolbar-container");

    // This is rendering the button on the pop-up tool box
    this._button = document.createElement("button");
    (this._button as any).type = "button";
    this._button.classList.add(this.iconClasses.base);
    this._button.innerHTML = this.toolboxIcon;

    // If the term is active (already highlighted) then clicking the component button should de-highlight it and not show the color picker
    if (!this.isTermActive()) {
      this._button.addEventListener("click", (event) => {
        pickerToolBarContainer.classList.toggle("show");
      });
      pickerToolBarContainer.appendChild(this.renderColorPicker());
    } else {
      this._unwrapping = true;
    }

    buttonContainer.appendChild(this._button);
    mainContainer.appendChild(buttonContainer);
    mainContainer.appendChild(pickerToolBarContainer);

    return mainContainer;
  }

  private renderColorPicker() {
    let colorPickerContainer = document.createElement("div");
    colorPickerContainer.classList.add("color-picker-container");

    this._pallet.forEach((palletData) => {
      let colorPicker = document.createElement("div");
      colorPicker.classList.add("color-picker-element");
      colorPicker.addEventListener("click", () => {
        colorPickerContainer.parentElement?.classList.toggle("show");
        this._api.toolbar.close();
        this.customSurround(palletData);
      });
      colorPicker.style.backgroundColor = palletData.colorHex;
      colorPickerContainer.appendChild(colorPicker);
    });

    return colorPickerContainer;
  }

  public customSurround(palletData: PalletData) {
    if (!this._currentRange) {
      return;
    }
    /**
     * If start or end of selection is in the highlighted block
     */
    if (this._termWrapper) {
      this.unwrap(this._termWrapper);
    } else {
      this.wrap(this._currentRange, palletData);
    }
  }

  public surround(range: Range) {
    // This method is automatically called by EditorJs instance. I have to re-write it to make it
    // work with the custom color picker.
    this._currentRange = range;

    this._termWrapper = this._api.selection.findParentTag(
      this._tag,
      AnnoteMarker.CSS
    );

    if (this._termWrapper && this._unwrapping) {
      this.unwrap(this._termWrapper);
      this._unwrapping = false;
    }
  }

  /**
   *
   * @returns {number} - The next available pin number
   */
  private getNextAvailablePinNumber(): number {
    let pinNumbers = this.getPinNumbers();
    let nextPinNumber = 1;
    while (pinNumbers.includes(nextPinNumber)) {
      nextPinNumber++;
    }
    return nextPinNumber;
  }

  private wrap(range: Range, palletData: PalletData) {
    /**
     * Create a wrapper for highlighting
     */
    let marker = document.createElement(this._tag);

    // This pin is the number enclosed by cirlce
    let pin = document.createElement("div");

    marker.style.background = palletData.rgba;
    marker.classList.add(AnnoteMarker.CSS);

    const pinNumber = this.getNextAvailablePinNumber();

    marker.dataset.pin = pinNumber.toString();
    pin.innerHTML = pinNumber.toString();

    pin.classList.add(AnnoteMarker.getPinCSS);
    pin.style.backgroundColor = palletData.colorHex;

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */

    marker.appendChild(pin);
    marker.appendChild(range.extractContents());
    range.insertNode(marker);

    /**
     * Expand (add) selection to highlighted block
     */
    this._api.selection.expandToTag(marker);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper: any) {
    /**
     * Expand selection to all term-tag
     */
    this._api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel?.getRangeAt(0);

    let unwrappedContent = range?.extractContents();

    //***  Code to remove the pin.
    const pin = unwrappedContent?.firstChild;
    if (pin) {
      unwrappedContent?.removeChild(pin);
    }
    //

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range?.insertNode(unwrappedContent!);

    /**
     * Restore selection
     */
    sel?.removeAllRanges();
    sel?.addRange(range!);
  }

  get toolboxIcon(): string {
    return IconDotCircle;
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this._api.selection.findParentTag(
      this._tag,
      AnnoteMarker.CSS
    );
    this._button?.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * When user highlights a text, this method is called to check if the annote marker is active on the selection
   * @returns {boolean} - Returns true if the term is active
   */
  private isTermActive(): boolean {
    const termTag = this._api.selection.findParentTag(
      this._tag,
      AnnoteMarker.CSS
    );

    const it = this._button?.classList;
    this._button?.classList.toggle(this.iconClasses.active, !!termTag);
    return !!it?.contains(this.iconClasses.active);
  }

  /**
   * Sanitizer rule
   * @return {{mark: {class: string}}}
   */
  static get sanitize() {
    return {
      mark: {
        class: AnnoteMarker.CSS,
        "data-pin": true,
        style: true,
      },
      div: {
        class: AnnoteMarker.getPinCSS,
        style: true,
      },
    };
  }
}
