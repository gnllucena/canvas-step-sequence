class configuration {
    public _frequencies: number;
    public _margin: number;
    public _width: number;
    public _heigth: number;
    public _border: number;
    public _separation: number;
    public _backgroundColor: string;
    public _borderColor: string;
    public _shortcuts: shortcuts;

    constructor(
        _frequencies: number,
        _margin: number,
        _width: number,
        _heigth: number,
        _border: number,
        _separation: number,
        _backgroundColor: string,
        _borderColor: string,
        _shortcuts: shortcuts) 
    {
        if (_frequencies == null) {
            this._frequencies = 7;
        } else {
            this._frequencies = _frequencies;
        }
        
        if (_margin == null) {
            this._margin = 5;
        } else {
            this._margin = _margin;
        }
        
        if (_width == null) {
            this._width = 40;
        } else {
            this._width = _width;
        }
        
        if (_heigth == null) {
            this._heigth = 25;
        } else {
            this._heigth = _heigth;
        }
        
        if (_border == null) {
            this._border = 5;
        } else {
            this._border = _border;
        }
        
        if (_separation == null) {
            this._separation = 10;
        } else {
            this._separation = _separation;
        }

        if (_backgroundColor == null) {
            this._backgroundColor = '#EEEEEE';
        } else {
            this._backgroundColor = _backgroundColor;
        }

        if (_borderColor == null) {
            this._borderColor = '#000000';
        } else {
            this._borderColor = _borderColor;
        }

        if (_shortcuts == null) {
            this._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        } else {
            this._shortcuts = _shortcuts;
        }
    }
}