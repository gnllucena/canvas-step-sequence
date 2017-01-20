class configuration {
    _frequencies: number;
    _margin: number;
    _width: number;
    _heigth: number;
    _border: number;
    _separation: number;
    _selectedColor: string;
    _sensibility: number;
    _backgroundColor: string;
    _shortcuts: shortcuts;

    constructor(
        frequencies: number,
        margin: number,
        width: number,
        heigth: number,
        border: number,
        separation: number,
        selectedColor: string,
        backgroundColor: string,
        sensibility: number) 
    {
        if (frequencies == null) {
            this._frequencies = 7;
        } else {
            this._frequencies = frequencies;
        }
        
        if (margin == null) {
            this._margin = 5;
        } else {
            this._margin = margin;
        }
        
        if (width == null) {
            this._width = 40;
        } else {
            this._width = width;
        }
        
        if (heigth == null) {
            this._heigth = 25;
        } else {
            this._heigth = heigth;
        }
        
        if (border == null) {
            this._border = 5;
        } else {
            this._border = border;
        }
        
        if (separation == null) {
            this._separation = 10;
        } else {
            this._separation = separation;
        }

        if (selectedColor == null) {
            this._selectedColor = '#ff0000';
        } else {
            this._selectedColor = selectedColor;
        }

        if (backgroundColor == null) {
            this._backgroundColor = '#EEEEEE';
        } else {
            this._backgroundColor = backgroundColor;
        }

        if (sensibility == null) {
            this._sensibility = 0.4;
        } else {
            this._sensibility = sensibility;
        }

        this._shortcuts = new shortcuts(null, null, null, null, null, null, null);
    }
}