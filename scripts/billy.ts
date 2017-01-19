// playback:
// linha vertical do play vai até 50% do canvas 
// canvas começa a deslizar até o final
// linha vertical do play vai até 100% do canvas

// shortcuts:
// shift + click: joga no array de seleções o quadrado selecionado
// shift + drag: joga no array de seleções os quadrados selecionados
// ctrl + c / v: copia e cola
// ctrl + shift + seta: aumenta mais um na direção
// ctrl + shift + alt + number: transforma o motif

class billy {
    _canvas : HTMLCanvasElement;
    _configuration : configuration;
    _measures : Array<measure>;
    private _blocks: Array<block>;

    _isDragging: boolean = false;
    _isClicking: boolean = false;
    _isCtrlPressed: boolean = false;
    _isShiftPressed: boolean = false;
    _isUpArrowPressed: boolean = false;
    _isDownArrowPressed: boolean = false;
    _isLeftArrowPressed: boolean = false;
    _isRigthArrowPressed: boolean = false;

    _offsetX: number = 0;
    _offsetY: number = 0;
    _mouseX: number;
    _mouseY: number;

    _widthMeasures: number = 0;
    _heigthMeasures: number = 0;

    constructor(selector: string, config: configuration, measures: Array<measure>) {
        this._measures = measures;

        this._configuration = new configuration(
            config._frequencies, 
            config._margin, 
            config._width, 
            config._heigth, 
            config._border, 
            config._separation, 
            config._selectedColor, 
            config._backgroundColor);

        if (this._configuration._shortcuts == null) {
            this._configuration._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        }

        let that = this;

        this._canvas = <HTMLCanvasElement> document.getElementById(selector);
            
        this._canvas.addEventListener('keydown', function(e) { 
            that.handleKeyDown(e); 
            console.log('keydown handle called.');
        });

        this._canvas.addEventListener('keyup', function(e) { 
            that.handleKeyUp(e); 
            console.log('keyup handle called.');
        });

        this._canvas.addEventListener('mousedown', function(e) { 
            that.handleMouseDown(e);
            console.log('mousedown handle called.');
        });

        this._canvas.addEventListener('mouseup', function(e) { 
            that.handleMouseUp(e); 
            console.log('mouseup handle called.');
        });

        this._canvas.addEventListener('mousemove', function(e) { 
            that.handleMouseMove(e); 
            console.log('mousemove handle called.');
        });
        
        this._canvas.addEventListener('contextmenu', function(e) { 
            that.handleContextMenu(e); 
            console.log('contextmenu handle called.');
        }, false);

        this._canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        let factor = 0.05;
        let maxWidth = this._canvas.parentElement.offsetWidth - this._canvas.parentElement.offsetWidth * factor;
        let maxHeigth = (this._configuration._heigth * this._configuration._frequencies) + (this._configuration._border * (this._configuration._frequencies + 1)) + this._configuration._margin * 2;
        
        window.addEventListener('resize', function() {
            // It's necessary to recalculate canvas width everytime the window is resized
            that._canvas.width = that._canvas.parentElement.offsetWidth - that._canvas.parentElement.offsetWidth * factor;
            that._canvas.height = maxHeigth;

            that._offsetX = 0;
            that._offsetY = 0;

            that.draw();
            console.log('resize handle called.');
        });

        this._canvas.width = maxWidth;
        this._canvas.height = maxHeigth;
    }

    draw() {
        let context = this._canvas.getContext("2d");

        this._blocks = this.blocks();

        for (let block of this._blocks) {
            if (block._selected) {
                context.fillStyle = this._configuration._selectedColor;
            } else {
                context.fillStyle = this._configuration._backgroundColor;
            }

            context.fillRect(block._x, block._y, block._width, block._height);
        }
    }

    blocks() {
        // How canvas matrix is read
        // ------------------------------ ---------------- --------
        // --  1  --  2  --  3  --  4  -- --  13 --  14 -- -- 19 --
        // ------------------------------ ---------------- --------
        // --  5  --  6  --  7  --  8  -- --  15 --  16 -- -- 20 --
        // ------------------------------ ---------------- --------
        // --  9  --  10 --  11 --  12 -- --  17 --  18 -- -- 21 --
        // ------------------------------ ---------------- --------

        this._widthMeasures = 0;
        this._blocks = new Array<block>();

        let marginAndBorder = this._configuration._margin + this._configuration._border;
        let widthAndBorder = this._configuration._width + this._configuration._border;
        let heigthAndBorder = this._configuration._heigth + this._configuration._border;
        let marginAndSeparation = this._configuration._margin + this._configuration._separation;

        let heigthFrequencies = marginAndBorder;

        for (let i = 0; i <= this._measures.length - 1; i++) {
            let measure = this._measures[i];
            
            let pulsesTimesRhythm = measure._pulses * measure._rhythm;

            for (let w = 0; w <= this._configuration._frequencies - 1; w++) {
                let widthPulses = this._widthMeasures + marginAndBorder;

                this._blocks.push(new block(widthPulses - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth, false));

                for (let z = 1; z <= pulsesTimesRhythm - 1; z++) {
                    widthPulses += widthAndBorder;

                    this._blocks.push(new block(widthPulses - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth, false));
                }

                heigthFrequencies += heigthAndBorder;
            }

            heigthFrequencies = marginAndBorder;

            this._widthMeasures += (pulsesTimesRhythm * this._configuration._width) + ((pulsesTimesRhythm * this._configuration._border)) + marginAndSeparation;
        }

        // Because we don't have a separation in the end
        this._widthMeasures = this._widthMeasures - this._configuration._separation;

        return this._blocks;
    }

    behaviorOffset(e) {
        if (!this._isDragging) {
            return;
        }

        var rect = this._canvas.getBoundingClientRect();    

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let newX = x - this._mouseX;
        let newY = x - this._mouseY;

        this._offsetX += (newX - newX * 0.5) * -1;
        this._offsetY += (newY - newY * 0.5) * -1;

        this._mouseX = x; 
        this._mouseY = y;

        let margin = 10;

        if (this._widthMeasures < this._canvas.width) { 
            // if sum of measures width is lesser than canvas width, we don't have to worry about offsets
            this._offsetX = 0;
        } else {
            // if it's not, we can't let the draw in canvas offset forever
            if (this._offsetX > this._widthMeasures - this._canvas.width + this._configuration._margin + this._configuration._border) {
                this._offsetX = this._widthMeasures - this._canvas.width + this._configuration._margin + this._configuration._border;
            } else if (this._offsetX < 1) {
                this._offsetX = 0;
            }
        }

        let context = this._canvas.getContext("2d");
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this.draw();
    }

    behaviorClick(e) {
        if (!this._isClicking) {
            return;
        }

        // if (this._isClicking) {
        //     if (x > this._mouseX - margin &&
        //         x < this._mouseX + margin &&
        //         y > this._mouseY - margin &&
        //         y < this._mouseY + margin) {
        //             this._isClicking = false;
        //     }
        // }

        let sorted: Array<block> = this.blocks().slice(0).sort(function(a, b) { 
            if (a._x > b._x) {
                return 1;
            } else if (a._x < b._x) {
                return -1;
            }

            if (a._y < b._y) {
                return -1;
            } else if (a._y > b._y) {
                return 1;
            }
            
            return 0;
        });

        // group object by x axis, if click was before this axis
        // we don't need to check other blocks with the same x axis.
        let grouping = { };

        for (let block of sorted) {
            if (grouping[block._x] === undefined) {
                grouping[block._x] = [block._x];
            }

            grouping[block._x].push(block._y);
        }

        let length = Object.keys(grouping).length;
        let exit:boolean = false;

        // let's find out clicked block
        // todo: 
        // var filteredArray = array.filter(function (element) { 
        //     return element.id === 0;
        // });
        for (let i = 0; i <= length - 1; i++) {
            if (exit) {
                break;
            }

            let key = Object.keys(grouping)[i];

            let xofBlock:number = +key;

            if (xofBlock < 0) {
                continue;
            }

            // check if click was beyond block
            if (this._mouseX > xofBlock) {
                if (this._mouseX > xofBlock + this._configuration._width) {
                    break;
                }
            }

            // must check if click was in range of a block
            if (xofBlock <= this._mouseX && this._mouseX < xofBlock + this._configuration._width) {
                let ys:[number] = grouping[key];

                for (let w = 0; w <= ys.length - 1; w++) {
                    if (exit) {
                        break;
                    }

                    let yofBlock:number = ys[w];

                    if (yofBlock < 0) {
                        continue;
                    }

                    // check if click was beyond block
                    if (this._mouseY > yofBlock) {
                        if (this._mouseY > yofBlock + this._configuration._heigth) {
                            exit = true;
                            break;
                        }
                    }

                    if (yofBlock <= this._mouseY && this._mouseY < yofBlock + this._configuration._width) {
                        let index:number = this._blocks.map(function(x) { 
                            return x._x.toString() + '-' + x._y 
                        }).indexOf(xofBlock.toString() + '-' + yofBlock.toString())
                        
                        let block:block = this._blocks[index];
                        block.select();
                        
                        let context = this._canvas.getContext("2d");

                        context.fillStyle = this._configuration._selectedColor;
                        context.fillRect(xofBlock, yofBlock, this._configuration._width, this._configuration._heigth);

                        exit = true;
                    }
                }
            }
        }
    }
    
    handleKeyDown(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleKeyUp(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        let rect = this._canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        this._mouseX = x; 
        this._mouseY = y;
        this._isDragging = true;
        this._isClicking = true;
    }

    handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        this.behaviorClick(e);

        this._isDragging = false;
        this._isClicking = false;
    }

    handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        this.behaviorOffset(e);
    }

    handleContextMenu(e) {
    }

    getMeasures() {
    }
}