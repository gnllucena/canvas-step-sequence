class shortcuts {
    _moveSelectionUp: number[];
    _moveSelectionLeft: number[];
    _moveSelectionRight: number[];
    _moveSelectionDown: number[];
    _copySelection: number[];
    _pasteSelection: number[];
    _deleteSelection: number[];

    constructor(
        _moveSelectionUp: number[], 
        _moveSelectionLeft: number[],
        _moveSelectionRight: number[],
        _moveSelectionDown: number[],
        _copySelection: number[],
        _pasteSelection: number[],
        _deleteSelection: number[]) 
    {
        if (_moveSelectionUp == null) {
            this._moveSelectionUp = [23, 54, 33];
        } else { 
            this._moveSelectionUp = _moveSelectionUp; 
        }

        if (_moveSelectionLeft == null) {
            this._moveSelectionLeft = [23, 54, 33];
        } else { 
            this._moveSelectionLeft = _moveSelectionLeft; 
        }

        if (_moveSelectionRight == null) {
            this._moveSelectionRight = [23, 54, 33];
        } else { 
            this._moveSelectionRight = _moveSelectionRight; 
        }

        if (_moveSelectionDown == null) {
            this._moveSelectionDown = [23, 54, 33];
        } else { 
            this._moveSelectionDown = _moveSelectionDown; 
        }

        if (_copySelection == null) {
            this._copySelection = [23, 54, 33];
        } else { 
            this._copySelection = _copySelection; 
        }

        if (_pasteSelection == null) {
            this._pasteSelection = [23, 54, 33];
        } else { 
            this._pasteSelection = _pasteSelection; 
        }

        if (_deleteSelection == null) {
            this._deleteSelection = [23, 54, 33];
        } else { 
            this._deleteSelection = _deleteSelection; 
        }
    }
}