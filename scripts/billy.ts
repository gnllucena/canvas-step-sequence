// atalhos:
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

    _measuresWidth: number = 0;
    _measuresHeight: number = 0;

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
            // é necessário recalcular porque a janela sofreu um resize
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
        let width = 0;
        for(let i = 0; i <= this._measures.length - 1; i++) {
            let pulses = this._measures[i]._pulses * this._measures[i]._rhythm;

            width += (pulses * this._configuration._width) + (pulses * this._configuration._border) + this._configuration._margin + this._configuration._separation;
        }

        let context = this._canvas.getContext("2d");

        let x = this._configuration._margin;
        let y = this._configuration._margin;

        context.beginPath();

        for (let i = 0; i <= this._measures.length - 1; i++) {            
            context.moveTo(x, y);

            // x
            for(let w = 0; w <= this._configuration._frequencies; w++) {
                let line = w == 0 ? 0 : this._configuration._border;

                for (let z = 0; z <= this._configuration._border; z++) {
                    context.moveTo(x - this._offsetX, y + (this._configuration._heigth + line) * w + z);
                    context.lineTo(x + (this._configuration._width * this._measures[i]._pulses * this._measures[i]._rhythm) + (this._configuration._border * this._measures[i]._pulses * this._measures[i]._rhythm) + this._configuration._border - this._offsetX, y + (this._configuration._heigth + line) * w + z);
                }
            }
            
            // y
            for(let w = 0; w <= this._measures[i]._pulses * this._measures[i]._rhythm; w++) {
                let line = w == 0 ? 0 : this._configuration._border;

                for (let z = 0; z <= this._configuration._border; z++) {
                    context.moveTo(x + (this._configuration._width + line) * w + z - this._offsetX, y);
                    context.lineTo(x + (this._configuration._width + line) * w + z - this._offsetX, y + (this._configuration._heigth * this._configuration._frequencies) + (this._configuration._border * (this._configuration._frequencies + 1)));
                }
            }

            x += this._configuration._margin + (this._configuration._width * this._measures[i]._pulses * this._measures[i]._rhythm) + (this._configuration._border * this._measures[i]._pulses * this._measures[i]._rhythm) + this._configuration._separation;
        }

        context.strokeStyle = this._configuration._borderColor;
        context.closePath();
        context.stroke();

        this._measuresWidth = x;

        this._blocks = this.blocks();

        for (let block of this._blocks) {
            context.fillStyle = this._configuration._backgroundColor;
            context.fillRect(block._x, block._y, block._width, block._height);
        }
    }

    blocks() {
        // preenchimento da matriz:
        // ------------------------------ ------------------------------
        // --  1  --  2  --  3  --  4  -- --  13 --  14 --  15 --  16 --
        // ------------------------------ ------------------------------
        // --  5  --  6  --  7  --  8  -- --  17 --  18 --  19 --  20 --
        // ------------------------------ ------------------------------
        // --  9  --  10 --  11 --  12 -- --  21 --  22 --  23 --  24 --
        // ------------------------------ ------------------------------

        let marginAndBorder = this._configuration._margin + this._configuration._border;
        let widthAndBorder = this._configuration._width + this._configuration._border;
        let heigthAndBorder = this._configuration._heigth + this._configuration._border;
        let marginAndSeparation = this._configuration._margin + this._configuration._separation;

        let heigthFrequencies = marginAndBorder;

        this._blocks = new Array<block>();

        let aux = 0;

        for (let i = 0; i <= this._measures.length - 1; i++) {
            let measure = this._measures[i];
            
            let pulsesAndRhythm = measure._pulses * measure._rhythm;

            aux += ((pulsesAndRhythm * this._configuration._width) + (pulsesAndRhythm * this._configuration._border) +  marginAndSeparation);
            
            for (let w = 0; w <= this._configuration._frequencies - 1; w++) {
                let widthPulses = marginAndBorder;

                this._blocks.push(new block(widthPulses + aux - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth));

                for (let z = 1; z <= pulsesAndRhythm - 1; z++) {
                    widthPulses += widthAndBorder;

                    this._blocks.push(new block(widthPulses + aux - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth));
                }

                heigthFrequencies += heigthAndBorder;
            }

            //aux += widthMeasure;

            heigthFrequencies = marginAndBorder;
        }

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
        e.preventDefault();
        e.stopPropagation();

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
            if (this._offsetX > this._measuresWidth - this._canvas.width - this._configuration._separation) {
                this._offsetX = this._measuresWidth - this._canvas.width - this._configuration._separation + this._configuration._border;
            } else if (this._offsetX < 1) {
                this._offsetX = 0;
            }

            // caso as medidas somadas sejam menores que o tamanho do canvas, as medidas devem sempre encostar na esquerda
            if (this._measuresWidth < this._canvas.width) {
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