import { IconDotCircle } from "@codexteam/icons";
import "./style.css";

export interface AnnoteMarkerData {
  text: string;
}

export interface AnnoteMarkerConfig {
  placeholder?: string;
  someCustom?: any;
}

export default class AnnoteMarker {
  private _api: { [key in string]: any };
  private _button: HTMLElement | null;
  private _tag: string;
  private _data: AnnoteMarkerData;
  private _config: AnnoteMarkerConfig;

  // This is for future reference for the colors we can use based on the figma design
  private readonly pallet: { label: string; colorHex: string }[] = [
    {
      label: "blue",
      colorHex: "#0084C3",
    },
    {
      label: "pink",
      colorHex: "#F1607D",
    },
    {
      label: "red",
      colorHex: "#F64C00",
    },
    {
      label: "gold",
      colorHex: "#CEA000",
    },
    {
      label: "green",
      colorHex: "#02A856",
    },
    {
      label: "teal",
      colorHex: "#03A58D",
    },
    {
      label: "purple",
      colorHex: "#821EB1",
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

  private getPinCount(): number {
    return document.getElementsByClassName(AnnoteMarker.getPinCSS).length;
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
    // This is rendering the button on the pop-up tool box
    this._button = document.createElement("button");
    (this._button as any).type = "button";
    this._button.classList.add(this.iconClasses.base);
    this._button.innerHTML = this.toolboxIcon;
    return this._button;
  }

  public surround(range: Range) {
    if (!range) {
      return;
    }
    const termWrapper = this._api.selection.findParentTag(
      this._tag,
      AnnoteMarker.CSS
    );

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  private getNextAvailablePinNumber(): number {
    let pinNumbers = this.getPinNumbers();
    let nextPinNumber = 1;
    while (pinNumbers.includes(nextPinNumber)) {
      nextPinNumber++;
    }
    return nextPinNumber;
  }

  private wrap(range: Range) {
    /**
     * Create a wrapper for highlighting
     */

    // Figre out elements and CSS for creating numbers
    let marker = document.createElement(this._tag);

    let pin = document.createElement("div");

    marker.classList.add(AnnoteMarker.CSS);

    const pinNumber = this.getNextAvailablePinNumber();

    marker.dataset.pin = pinNumber.toString();
    pin.innerHTML = pinNumber.toString();
    pin.classList.add(AnnoteMarker.getPinCSS);

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
   * Sanitizer rule
   * @return {{mark: {class: string}}}
   */
  static get sanitize() {
    return {
      mark: {
        class: AnnoteMarker.CSS,
        "data-pin": true,
      },
      div: {
        class: AnnoteMarker.getPinCSS,
        style: true,
      },
    };
  }
}
