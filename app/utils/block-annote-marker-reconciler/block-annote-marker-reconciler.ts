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
            (block.data as AnyBlockType).text
          );
          outputBlocks.push(block);
          break;
        case EditorJsBlockType.List:
          // We need to loop through the items and reconcile the text
          const listItems: string[] = [];
          for (const item of (block.data as ListData).items) {
            listItems.push(this.reconcileTextBlock(item));
          }
          (block.data as ListData).items = listItems;
          outputBlocks.push(block);
          break;
        default:
          outputBlocks.push(block);
      }
    }
    return { blocks: outputBlocks, map: this._uuidPinMap };
  }

  private reconcileTextBlock(text: string): string {
    // This keeps track of the pins that were assigned in the initial parsing
    const pinsSelected: number[] = [];

    if (text.includes("data-pin=")) {
      // The firstTextCleanupp updates the data-pin attribute to the new pin number
      const firstTextCleanup = text.replace(/data-pin="\d+"/g, () => {
        const replacementData = `data-pin="${this._pinCount}"`;
        pinsSelected.push(this._pinCount);
        this._pinCount++;
        return replacementData;
      });

      // This is used to keep track of the index of the pinsSelected array
      let i = 0;

      // The div with the pin number is in the format <div class="pin" style="background-color rgb(x, y, z)">{x}</div>
      // The secondTextCleanup replaces the {x} with the new pin number, using pinSelected array that kept track of the pins assigned above
      const secondTextCleanup = firstTextCleanup.replace(
        /<div class="pin" style="background-color: rgb\(\d+, \d+, \d+\);">\d+<\/div>/g,
        (substring) => {
          // Replace the number between the div tags with the new pin number
          const replacementData = substring.replace(
            />\d+</,
            `>${pinsSelected[i].toString()}<`
          );
          i++;
          return replacementData;
        }
      );

      this.createUuidPinNumberMap(secondTextCleanup.split("<mark class="));
      return secondTextCleanup;
    }
    return text;
  }

  private createUuidPinNumberMap(splitText: string[]) {
    // This function creates a map of the uuid to the pin number
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
