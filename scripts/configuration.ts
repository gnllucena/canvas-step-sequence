class Configuration {
    selector: string;
    frequencies: number;
    margin: number;
    width: number;
    heigth: number;
    border: number;
    separation: number;
    selectedColor: string;
    backgroundColor: string;
    shortcuts: Shortcuts;

    constructor(
        _selector: string,
        _frequencies: number,
        _margin: number,
        _width: number,
        _heigth: number,
        _border: number,
        _separation: number,
        _selectedColor: string,
        _backgroundColor: string,
        _shortcuts: Shortcuts
    ) {
        if (_selector == undefined) {
            this.selector = "canvas";
        }
        else {
            this.selector = _selector;
        }

        if (_frequencies == undefined) {
            this.frequencies = 7;
        } 
        else {
            this.frequencies = _frequencies;
        }
        
        if (_margin == undefined) {
            this.margin = 5;
        } 
        else {
            this.margin = _margin;
        }
        
        if (_width == undefined) {
            this.width = 40;
        } 
        else {
            this.width = _width;
        }
        
        if (_heigth == undefined) {
            this.heigth = 25;
        } 
        else {
            this.heigth = _heigth;
        }
        
        if (_border == undefined) {
            this.border = 5;
        } 
        else {
            this.border = _border;
        }
        
        if (_separation == undefined) {
            this.separation = 10;
        } 
        else {
            this.separation = _separation;
        }

        if (_selectedColor == undefined) {
            this.selectedColor = '#ff0000';
        } 
        else {
            this.selectedColor = _selectedColor;
        }

        if (_backgroundColor == undefined) {
            this.backgroundColor = '#EEEEEE';
        } else {
            this.backgroundColor = _backgroundColor;
        }

        if (_shortcuts == undefined) {
            this.shortcuts = new Shortcuts(null, null, null, null, null, null);
        } 
        else {
            this.shortcuts = new Shortcuts(
                _shortcuts.moveSelectionUp,
                _shortcuts.moveSelectionLeft,
                _shortcuts.moveSelectionRight,
                _shortcuts.moveSelectionDown,
                _shortcuts.copySelection,
                _shortcuts.pasteSelection);
        }
    }
}