class Block {
    x: number;
    y: number;
    width: number;
    height: number;
    printed: boolean;
    selected: boolean;

    constructor(
        _x: number, 
        _y: number, 
        _width: number, 
        _height: number
    ) {
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.printed = false;
        this.selected = false;
    }
}