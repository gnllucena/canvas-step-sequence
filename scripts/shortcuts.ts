class Shortcuts {
    moveSelectionUp: number[];
    moveSelectionLeft: number[];
    moveSelectionRight: number[];
    moveSelectionDown: number[];
    copySelection: number[];
    pasteSelection: number[];

    constructor(
        _moveSelectionUp: number[], 
        _moveSelectionLeft: number[],
        _moveSelectionRight: number[],
        _moveSelectionDown: number[],
        _copySelection: number[],
        _pasteSelection: number[],
        _deleteSelection: number[]) 
    {
        if (_moveSelectionUp == undefined) {
            this.moveSelectionUp = [23, 54, 33];
        } 
        else { 
            this.moveSelectionUp = _moveSelectionUp; 
        }

        if (_moveSelectionLeft == undefined) {
            this.moveSelectionLeft = [23, 54, 33];
        } 
        else { 
            this.moveSelectionLeft = _moveSelectionLeft; 
        }

        if (_moveSelectionRight == undefined) {
            this.moveSelectionRight = [23, 54, 33];
        } 
        else { 
            this.moveSelectionRight = _moveSelectionRight; 
        }

        if (_moveSelectionDown == undefined) {
            this.moveSelectionDown = [23, 54, 33];
        } 
        else {
            this.moveSelectionDown = _moveSelectionDown; 
        }

        if (_copySelection == undefined) {
            this.copySelection = [23, 54, 33];
        } 
        else {
            this.copySelection = _copySelection; 
        }

        if (_pasteSelection == undefined) 
        {
            this.pasteSelection = [23, 54, 33];
        } 
        else {
            this.pasteSelection = _pasteSelection; 
        }
    }
}