import { IconDotCircle } from "@codexteam/icons";
import "./style.css";
interface AnnoteMarkerConfig {
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
  private _config: AnnoteMarkerConfig;

  private _unwrapping: boolean = false;

  // The colors we can use based on the figma design
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

  constructor({ api, config }: { api: Object; config: AnnoteMarkerConfig }) {
    this._api = api;
    this._button = null;
    this._tag = "MARK";
    this._config = config;

    // CSS Classes
    this.iconClasses = {
      base: this._api.styles.inlineToolButton,
      active: this._api.styles.inlineToolButtonActive,
    };
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

    if (!this.isTermActive()) {
      // Term active means that there is a highlighted section of text. If there is no highlighted section of text, then show the color picker when the user clicks the tool button.
      this._button.addEventListener("click", (event) => {
        pickerToolBarContainer.classList.toggle("show");
      });
      pickerToolBarContainer.appendChild(this.renderColorPicker());
    } else {
      // This is for the case when the term is already highlighted and the user wants to de-highlight it. It's hacky.
      // When the user clicks the tool button, it should de-highlight the term and not show the color picker.
      this._unwrapping = true;
    }

    buttonContainer.appendChild(this._button);
    mainContainer.appendChild(buttonContainer);
    mainContainer.appendChild(pickerToolBarContainer);

    return mainContainer;
  }

  public handleColorPickerClicked(palletData: PalletData) {
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
    // This method is required and automatically called by EditorJs immediately after the render method.
    // The range parameter is automatically passed down by EditorJs.
    this._currentRange = range;

    this._termWrapper = this._api.selection.findParentTag(
      this._tag,
      AnnoteMarker.CSS
    );

    // this._unwrapping is hacky, and mainly means that the user is de-highlighting the section of text (removing the marker)
    // I have this if-block here just to stop weird behavior with the toolbar not disappearing or working properly.
    if (this._termWrapper && this._unwrapping) {
      this.unwrap(this._termWrapper);
      this._unwrapping = false;
    }
  }

  /**
   *
   * @returns {HTMLElement} - The color picker element
   */
  private renderColorPicker() {
    let colorPickerContainer = document.createElement("div");
    colorPickerContainer.classList.add("color-picker-container");

    this._pallet.forEach((palletData) => {
      let colorPicker = document.createElement("div");
      colorPicker.classList.add("color-picker-element");
      colorPicker.addEventListener("click", () => {
        colorPickerContainer.parentElement?.classList.toggle("show");
        this._api.toolbar.close();
        this.handleColorPickerClicked(palletData);
      });
      colorPicker.style.backgroundColor = palletData.colorHex;
      colorPickerContainer.appendChild(colorPicker);
    });

    return colorPickerContainer;
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

  /**
   *
   * @returns {number[]} - An array of all the pin numbers in the document
   */
  private getPinNumbers(): number[] {
    let pins = document.getElementsByClassName(AnnoteMarker.CSS) as any;
    let pinNumbers: number[] = [];
    for (let i = 0; i < pins.length; i++) {
      pinNumbers.push(parseInt(pins[i].dataset.pin!));
    }
    return pinNumbers;
  }

  /**
   *
   * This is the function responsible for highlighting the selected text and inserting a pin (the circle with the number)
   */
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

  private iconClasses: {
    base: string;
    active: string;
  };

  /**
   * Unwrap term-tag - de-highlight and remove the pin, essentially
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  private unwrap(termWrapper: any) {
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

  // This returns the icon for the tool button
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
   * Sanitizer rule. EditorJS will filter out attributes on tags that aren't in these santize rules.
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

  static get CSS() {
    return "cdx-marker";
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get getPinCSS() {
    return "pin";
  }
}
