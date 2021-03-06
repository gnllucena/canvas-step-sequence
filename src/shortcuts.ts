class Shortcuts {
    selection: number[];
    removeSelection: number[];
    rhythmChange: number[];
    pulsesChange: number[];
    movingSelectionUp: number[];
    movingSelectionRight: number[];
    movingSelectionDown: number[];
    movingSelectionLeft: number[];
    pastingSelectionUp: number[];
    pastingSelectionRight: number[];
    pastingSelectionDown: number[];
    pastingSelectionLeft: number[]

    constructor(
        _selection: number[],
        _removeSelection: number[],
        _rhythmChange: number[],
        _pulsesChange: number[],
        _movingSelectionUp: number[],
        _movingSelectionRight: number[],
        _movingSelectionDown: number[],
        _movingSelectionLeft: number[],
        _pastingSelectionUp: number[],
        _pastingSelectionRight: number[],
        _pastingSelectionDown: number[],
        _pastingSelectionLeft: number[]
    ) {
        if (_selection == undefined) {
            this.selection = [16];
        } 
        else { 
            this.selection = _selection; 
        }

        if (_removeSelection == undefined) {
            this.removeSelection = [27];
        } 
        else { 
            this.removeSelection = _removeSelection; 
        }

        if (_rhythmChange == undefined) {
            this.rhythmChange = [16];
        } 
        else {
            this.rhythmChange = _rhythmChange;
        }

        if (_pulsesChange == undefined) {
            this.pulsesChange = [17];
        } 
        else {
            this.pulsesChange = _pulsesChange;
        }

        if (_movingSelectionUp == undefined) {
            this.movingSelectionUp = [38];
        } 
        else { 
            this.movingSelectionUp = _movingSelectionUp; 
        }

        if (_movingSelectionRight == undefined) {
            this.movingSelectionRight = [39];
        } 
        else { 
            this.movingSelectionRight = _movingSelectionRight; 
        }

        if (_movingSelectionDown == undefined) {
            this.movingSelectionDown = [40];
        } 
        else {
            this.movingSelectionDown = _movingSelectionDown; 
        }

        if (_movingSelectionLeft == undefined) {
            this.movingSelectionLeft = [37];
        } 
        else {
            this.movingSelectionLeft = _movingSelectionLeft; 
        }

        if (_pastingSelectionUp == undefined) {
            this.pastingSelectionUp = [16, 17, 38];
        } 
        else { 
            this.pastingSelectionUp = _pastingSelectionUp; 
        }

        if (_pastingSelectionRight == undefined) {
            this.pastingSelectionRight = [16, 17, 39];
        } 
        else { 
            this.pastingSelectionRight = _pastingSelectionRight; 
        }

        if (_pastingSelectionDown == undefined) {
            this.pastingSelectionDown = [16, 17, 40];
        } 
        else {
            this.pastingSelectionDown = _pastingSelectionDown; 
        }

        if (_pastingSelectionLeft == undefined) {
            this.pastingSelectionLeft = [16, 17, 37];
        } 
        else {
            this.pastingSelectionLeft = _pastingSelectionLeft; 
        }
    }
}