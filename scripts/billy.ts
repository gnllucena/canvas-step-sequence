class billy {
    _canvas : HTMLCanvasElement;
    _config : configuration;
    _measures : Array<measure>;

    _isMouseClicked: boolean = false;
    _isMouseUnclicked: boolean = false;
    _isCtrlPressed: boolean = false;
    _isShiftPressed: boolean = false;
    _isUpArrowPressed: boolean = false;
    _isDownArrowPressed: boolean = false;
    _isLeftArrowPressed: boolean = false;
    _isRigthArrowPressed: boolean = false;

    _offset: number = 0;
    _mouseX: number;
    _mouseY: number;

    constructor(selector: string, config: configuration, measures: Array<measure>) {
        this._measures = measures;

        this._config = new configuration(
            config._frequencies, 
            config._margin, 
            config._width, 
            config._heigth, 
            config._border, 
            config._separation, 
            config._backgroundColor, 
            config._borderColor, 
            config._shortcuts);

        if (this._config._shortcuts == null) {
            this._config._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        }

        let that = this;

        this._canvas = <HTMLCanvasElement> document.getElementById(selector);
    
        this._canvas.addEventListener('click', function(e) { that.handleClick(e); });
        this._canvas.addEventListener('keydown', function(e) { that.handleKeyDown(e); });
        this._canvas.addEventListener('keyup', function(e) { that.handleKeyUp(e); });
        this._canvas.addEventListener('mousedown', function(e) { that.handleMouseDown(e); });
        this._canvas.addEventListener('mouseup', function(e) { that.handleMouseUp(e); });
        this._canvas.addEventListener('mousemove', function(e) { that.handleMouseMove(e); });
        this._canvas.addEventListener('mouseout', function(e) { that.handleMouseOut(e); });
        this._canvas.addEventListener('contextmenu', function(e) { that.handleContextMenu(e); }, false);

        this._canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        let factor = 0.05;
        let maxWidth = this._canvas.parentElement.offsetWidth - this._canvas.parentElement.offsetWidth * factor;
        let maxHeigth = (this._config._heigth * this._config._frequencies) + (this._config._border * (this._config._frequencies + 1)) + this._config._margin * 2;
        
        window.addEventListener('resize', function() {
            that._canvas.width = that._canvas.parentElement.offsetWidth - that._canvas.parentElement.offsetWidth * factor;
            that._canvas.height = maxHeigth;
            that.draw();
        });

        this._canvas.width = maxWidth;
        this._canvas.height = maxHeigth;
    }

    draw() {
        let width = 0;
        for(let i = 0; i <= this._measures.length - 1; i++) {
            let pulses = this._measures[i]._pulses * this._measures[i]._rhythm;

            width += (pulses * this._config._width) + (pulses * this._config._border) + this._config._margin + this._config._separation;
        }

        let context = this._canvas.getContext("2d");

        let x = this._config._margin;
        let y = this._config._margin;

        for (let i = 0; i <= this._measures.length - 1; i++) {            
            context.moveTo(x, y);

            // x
            for(let w = 0; w <= this._config._frequencies; w++) {
                let line = w == 0 ? 0 : this._config._border;

                for (let z = 0; z <= this._config._border; z++) {
                    context.moveTo(x, y + (this._config._heigth + line) * w + z);
                    context.lineTo(x + (this._config._width * this._measures[i]._pulses * this._measures[i]._rhythm) + (this._config._border * this._measures[i]._pulses * this._measures[i]._rhythm) + this._config._border, y + (this._config._heigth + line) * w + z);
                }
            }
            
            // y
            for(let w = 0; w <= this._measures[i]._pulses * this._measures[i]._rhythm; w++) {
                let line = w == 0 ? 0 : this._config._border;

                for (let z = 0; z <= this._config._border; z++) {
                    context.moveTo(x + (this._config._width + line) * w + z, y);
                    context.lineTo(x + (this._config._width + line) * w + z, y + (this._config._heigth * this._config._frequencies) + (this._config._border * (this._config._frequencies + 1)));
                }
            }

            x += this._config._margin + (this._config._width * this._measures[i]._pulses * this._measures[i]._rhythm) + (this._config._border * this._measures[i]._pulses * this._measures[i]._rhythm) + this._config._separation;
        }

        context.strokeStyle = this._config._borderColor;
        context.stroke();
        context.closePath();
    }

    handleClick(e) {
        
    }

    handleKeyDown(e) {

    }

    handleKeyUp(e) {

    }

    handleMouseDown(e) {
        document.body.style.cursor = 'pointer';

        this._isMouseClicked = true;
        this._isMouseUnclicked = false;
    }

    handleMouseUp(e) {
        document.body.style.cursor = 'default';

        this._isMouseClicked = false;
        this._isMouseUnclicked = true;
    }

    handleMouseOut(e) {
        document.body.style.cursor = 'default';
    }

    handleMouseMove(e) {
        var rect = this._canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        //this._offset = x;

        this._mouseX = x; 
        this._mouseY = y;

        if (this._isMouseClicked) {
            document.body.style.cursor = 'move';

            this.draw();
        }
    }

    handleContextMenu(e) {

    }

    getBlocksMap() {
        // var widthSeparation = 0;
        // var widthPulse = 0;
        // var heightPulse = 0;
        
        // if (map.length == 0) {
        //     for(var i = 0; i <= measures - 1; i++) {
        //         heightPulse = 0;
        //         var aux = 0;
        //         for(var x = 0; x <= frequencies - 1; x++) {
        //             var yOfPulsesPixel = margin + border + heightPulse;
        //             for(var y = 0; y <= pulses - 1; y++) {
        //                 var xOfPulsesPixel = margin + border + widthPulse + widthSeparation;
                        
        //                 widthPulse += border + width;
                        
        //                 map.push([xOfPulsesPixel, yOfPulsesPixel, width, heigth]);
        //             }
        //             widthPulse = 0;
        //             heightPulse += border + heigth;
        //         }
                
        //         widthSeparation += widthPerMeasure + margin + separation;
        //     }
        // }

        // return map;
    }

    getMeasuresMap() {

    }
}