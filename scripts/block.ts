class block {
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    _selected: boolean;

    constructor(
        x: number, 
        y: number, 
        width: number, 
        height: number,
        selected: boolean) 
    {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._selected = selected;
    }

    select() {
        this._selected = true;
    }

    unselect() {
        this._selected = false;
    }
}