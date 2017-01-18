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
    _blocks: Array<block>;

    _isDragging: boolean = false;
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
            config._backgroundColor, 
            config._borderColor, 
            config._shortcuts);

        if (this._configuration._shortcuts == null) {
            this._configuration._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        }

        let that = this;

        this._canvas = <HTMLCanvasElement> document.getElementById(selector);
    
        this._canvas.addEventListener('click', function(e) { 
            that.handleClick(e); 
            console.log('click handle called.');
        });
        
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

        this._canvas.addEventListener('mouseout', function(e) { 
            that.handleMouseOut(e);
            console.log('mouseout handle called.');
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
            // It's necessáry to recalculate the canvas width everytime the window is resized
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

        let x = this._configuration._margin;
        let y = this._configuration._margin;

        context.beginPath();
        
        let heigthTimesFrequencies = this._configuration._heigth * this._configuration._frequencies;
        let blocksTimesBorder = this._configuration._border * (this._configuration._frequencies + 1);
        
        let yofY = y + heigthTimesFrequencies + blocksTimesBorder;

        for (let i = 0; i <= this._measures.length - 1; i++) {
            let measure = this._measures[i];

            let pulsesTimeRhythm = measure._pulses * measure._rhythm;
            let usefulMeasureArea = pulsesTimeRhythm * this._configuration._width + pulsesTimeRhythm * this._configuration._border;

            let xofX = x + usefulMeasureArea + this._configuration._border;
        
            // x
            for(let w = 0; w <= this._configuration._frequencies; w++) {
                let line = w == 0 ? 0 : this._configuration._border;

                line += this._configuration._heigth;

                for (let z = 0; z <= this._configuration._border; z++) {
                    let yofX = line * w + y + z;

                    context.moveTo(x - this._offsetX, yofX);
                    context.lineTo(xofX - this._offsetX, yofX);
                }
            }
            
            // y
            for(let w = 0; w <= pulsesTimeRhythm; w++) {
                let line = w == 0 ? 0 : this._configuration._border;

                line += this._configuration._width;

                for (let z = 0; z <= this._configuration._border; z++) {
                    let xofY = line * w + x + z - this._offsetX;

                    context.moveTo(xofY, y);
                    context.lineTo(xofY, yofY);
                }
            }

            x += usefulMeasureArea + this._configuration._margin + this._configuration._separation;
        }

        context.strokeStyle = this._configuration._borderColor;
        context.closePath();
        context.stroke();

        this._blocks = this.blocks();

        for (let block of this._blocks) {
            context.fillStyle = this._configuration._backgroundColor;
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

                this._blocks.push(new block(widthPulses - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth));

                for (let z = 1; z <= pulsesTimesRhythm - 1; z++) {
                    widthPulses += widthAndBorder;

                    this._blocks.push(new block(widthPulses - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth));
                }

                heigthFrequencies += heigthAndBorder;
            }

            heigthFrequencies = marginAndBorder;

            this._widthMeasures += (pulsesTimesRhythm * this._configuration._width) + ((pulsesTimesRhythm * this._configuration._border)) + marginAndSeparation;
        }

        // Because we don't have a separation in the end
        this._widthMeasures = this._widthMeasures - this._configuration._separation + this._configuration._border;

        return this._blocks;
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleKeyDown(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleKeyUp(e) {
        e.preventDefault();
        e.stopPropagation();

        this._isDragging = false;
    }

    handleMouseDown(e) {
        // e.preventDefault();
        // e.stopPropagation();

        document.body.style.cursor = 'pointer';

        var rect = this._canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        this._mouseX = x; 
        this._mouseY = y;
        this._isDragging = true;
    }

    handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        document.body.style.cursor = 'default';

        this._isDragging = false;
    }

    handleMouseOut(e) {
        e.preventDefault();
        e.stopPropagation();

        document.body.style.cursor = 'default';
    }

    handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this._isDragging) {
            var rect = this._canvas.getBoundingClientRect();

            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            this._offsetX += (x - this._mouseX) * -1;
            this._offsetY += (y - this._mouseY) * -1;

            // as medidas, quando maiores que o tamanho do canvas, não devem ultrapassar os limites do canvas
            if (this._offsetX > this._widthMeasures - this._canvas.width - this._configuration._separation) {
                this._offsetX = this._widthMeasures - this._canvas.width - this._configuration._separation + this._configuration._border;
            } else if (this._offsetX < 1) {
                this._offsetX = 0;
            }

            // caso as medidas somadas sejam menores que o tamanho do canvas, as medidas devem sempre encostar na esquerda
            if (this._widthMeasures < this._canvas.width) {
                this._offsetX = 0;
            }

            this._mouseX = x; 
            this._mouseY = y;
            
            let context = this._canvas.getContext("2d");
            context.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this.draw();

            console.log('offset:' + this._offsetX);
        }
    }

    handleContextMenu(e) {
    }   

    getMeasures() {
    }
}