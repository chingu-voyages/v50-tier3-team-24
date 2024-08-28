/* The purpose of this class is to take in the array of blocks from an annote document 
and resort the pin numbers in the correct order so they flow from top to bottom.
*/
export class BlockAnnoteMarkerReconciler {
  // Return a record that maps the uuid to the pin number after reconciliation
  private _uuidPinMap: Record<string, number> = {};

  private _pinCount = 1;

  public reconcile(inputBlocks: EditorJsBlock[]): {
    blocks: EditorJsBlock[];
    map: Record<string, number>;
  } {
    // Loop through the blocks. Remember that list need their own loop
    const outputBlocks: EditorJsBlock[] = [];

    for (const block of inputBlocks) {
      switch (block.type) {
        case EditorJsBlockType.Header:
        case EditorJsBlockType.Paragraph:
          (block.data as AnyBlockType).text = this.reconcileTextBlock(
            block.data as AnyBlockType
          );
          outputBlocks.push(block);
          break;
        case EditorJsBlockType.List:
        // We need to loop through the items
        default:
          outputBlocks.push(block);
      }
    }

    return { blocks: outputBlocks, map: this._uuidPinMap };
  }

  private reconcileTextBlock(block: AnyBlockType): string {
    if (block.text.includes("data-pin=")) {
      const newText = block.text.replace(/data-pin="\d+"/g, () => {
        const replacementData = `data-pin="${this._pinCount}"`;
        this._pinCount++;
        return replacementData;
      });

      const splitByMarkData = newText.split("<mark class=");
      this.parseSplitMarkData(splitByMarkData);
      return newText;
    }
    return block.text;
  }

  private parseSplitMarkData(splitText: string[]) {
    splitText.forEach((text) => {
      if (text.includes("data-pin=")) {
        const pin = this.extractPin(text.match(/data-pin="\d+"/g)![0]);
        const uuid = this.extractUuid(
          text.match(/data-uuid="\w+-\w+-\w+-\w+-\w+"/g)![0]
        );

        this._uuidPinMap[uuid] = pin;
      }
    });
  }

  private extractPin(text: string): number {
    const dataPin = text.split("=");
    return stringToInt(dataPin[1]);
  }

  private extractUuid(text: string): string {
    const dataUuid = text.split("=");
    return dataUuid[1].replace(/"/g, "");
  }
}

function stringToInt(text: string): number {
  const stringNumber = text.replace(/"/g, "");
  return parseInt(stringNumber);
}
