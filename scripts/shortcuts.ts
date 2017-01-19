class shortcuts {
    _moveSelectionUp: number[];
    _moveSelectionLeft: number[];
    _moveSelectionRight: number[];
    _moveSelectionDown: number[];
    _copySelection: number[];
    _pasteSelection: number[];
    _deleteSelection: number[];

    constructor(
        moveSelectionUp: number[], 
        moveSelectionLeft: number[],
        moveSelectionRight: number[],
        moveSelectionDown: number[],
        copySelection: number[],
        pasteSelection: number[],
        deleteSelection: number[]) 
    {
        if (moveSelectionUp == null) {
            this._moveSelectionUp = [23, 54, 33];
        } else { 
            this._moveSelectionUp = moveSelectionUp; 
        }

        if (moveSelectionLeft == null) {
            this._moveSelectionLeft = [23, 54, 33];
        } else { 
            this._moveSelectionLeft = moveSelectionLeft; 
        }

        if (moveSelectionRight == null) {
            this._moveSelectionRight = [23, 54, 33];
        } else { 
            this._moveSelectionRight = moveSelectionRight; 
        }

        if (moveSelectionDown == null) {
            this._moveSelectionDown = [23, 54, 33];
        } else { 
            this._moveSelectionDown = moveSelectionDown; 
        }

        if (copySelection == null) {
            this._copySelection = [23, 54, 33];
        } else { 
            this._copySelection = copySelection; 
        }

        if (pasteSelection == null) {
            this._pasteSelection = [23, 54, 33];
        } else { 
            this._pasteSelection = pasteSelection; 
        }

        if (deleteSelection == null) {
            this._deleteSelection = [23, 54, 33];
        } else { 
            this._deleteSelection = deleteSelection; 
        }
    }
}