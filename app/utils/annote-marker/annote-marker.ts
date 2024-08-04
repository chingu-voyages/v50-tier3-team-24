import { IconDotCircle } from "@codexteam/icons";

import { COLOR_PALLET_MAP } from "~/types/definitions/color-pallet-map/color-pallet-map";
import type { AnnoteMarkerConfig } from "./definitions/types";
import "./style.css";

export default class AnnoteMarker {
  private _api: { [key in string]: any };
  private _button: HTMLElement | null;
  private _tag: string;

  private _currentRange: Range | null = null;
  private _termWrapper: any = null;
  private _config: AnnoteMarkerConfig;

  private _unwrapping: boolean = false;

  // The colors we can use based on the figma design

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
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const colorPickerContainer = document.createElement("div");
    colorPickerContainer.classList.add("picker-toolbar-container");
    colorPickerContainer.style.backgroundColor = "white";

    // This is rendering the button on the pop-up tool box
    this._button = document.createElement("button");
    (this._button as any).type = "button";
    this._button.classList.add(this.iconClasses.base);
    this._button.innerHTML = this.toolboxIcon;

    if (!this.isTermActive()) {
      // Term active means that there is a highlighted section of text. If there is no highlighted section of text, then show the color picker when the user clicks the tool button.
      this._button.addEventListener("click", (event) => {
        colorPickerContainer.classList.toggle("show");
      });
      colorPickerContainer.appendChild(this.renderColorPicker());
    } else {
      // This is for the case when the term is already highlighted and the user wants to de-highlight it. It's hacky.
      // When the user clicks the tool button, it should de-highlight the term and not show the color picker.
      this._unwrapping = true;
    }

    buttonContainer.appendChild(this._button);
    mainContainer.appendChild(buttonContainer);
    mainContainer.appendChild(colorPickerContainer);

    return mainContainer;
  }

  private handleColorPalletClicked(palletData: ColorPallet) {
    if (!this._currentRange) {
      return;
    }

    // If start or end of selection is in the highlighted block
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
    const colorPickerContainer = document.createElement("div");
    colorPickerContainer.classList.add("color-picker-container");

    COLOR_PALLET_MAP.forEach((palletData) => {
      const colorPicker = document.createElement("div");
      colorPicker.classList.add("color-picker-element");
      colorPicker.addEventListener("click", () => {
        colorPickerContainer.parentElement?.classList.toggle("show");
        this._api.toolbar.close();
        this.handleColorPalletClicked(palletData);
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
    const pinNumbers = this.getPinNumbers();
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
    const pins = document.getElementsByClassName(AnnoteMarker.CSS) as any;
    const pinNumbers: number[] = [];
    for (let i = 0; i < pins.length; i++) {
      pinNumbers.push(parseInt(pins[i].dataset.pin!));
    }
    return pinNumbers;
  }

  /**
   *
   * This is the function responsible for highlighting the selected text and inserting a pin (the circle with the number)
   */
  private wrap(range: Range, palletData: ColorPallet) {
    // Create a wrapper for highlighting
    const marker = document.createElement(this._tag);

    // This pin is the number enclosed by cirlce
    const pin = document.createElement("div");

    marker.style.background = palletData.rgba;
    marker.classList.add(AnnoteMarker.CSS);

    const pinNumber = this.getNextAvailablePinNumber();

    marker.dataset.pin = pinNumber.toString();
    pin.innerHTML = pinNumber.toString();

    const newUuid = this.generateUuid();
    marker.dataset.uuid = newUuid;

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

    // Expand (add) selection to highlighted block
    this._api.selection.expandToTag(marker);

    if (this._config.onMarkerInserted) {
      this._config.onMarkerInserted({
        pinNumber: pinNumber,
        color: palletData.colorHex,
        text: marker.textContent!.substring(1),
        uuid: newUuid,
      });
    }
  }

  private iconClasses: {
    base: string;
    active: string;
  };

  private generateUuid(): string {
    return crypto.randomUUID();
  }
  /**
   * Unwrap term-tag - de-highlight and remove the pin, essentially
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  private unwrap(termWrapper: any) {
    // Expand selection to all term-tag
    this._api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);

    const unwrappedContent = range?.extractContents();

    // This removes the pin.
    const pin = unwrappedContent?.firstChild;
    if (pin) {
      unwrappedContent?.removeChild(pin);
    }

    // Remove empty term-tag
    termWrapper.parentNode.removeChild(termWrapper);

    // Insert extracted content
    range?.insertNode(unwrappedContent!);

    // Restore selection
    sel?.removeAllRanges();
    sel?.addRange(range!);

    if (this._config.onMarkerDeleted) {
      this._config.onMarkerDeleted({
        pinNumber: termWrapper.dataset.pin,
        uuid: termWrapper.dataset.uuid,
      });
    }
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
        "data-uuid": true,
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
