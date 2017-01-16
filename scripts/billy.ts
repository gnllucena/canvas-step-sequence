class billy {
    context : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    parameters : parameters;
    measures : Array<measure>;
    blocksMap : Array<block>;
    measuresMap : Array<block>;

    constructor(parameters: parameters, measures: Array<measure>) {
        this.parameters = parameters;
        this.measures = measures;

        if (this.parameters.functions == null) {
            this.parameters.functions = new functions();
        }

        if (this.parameters.shortcuts == null) {
            this.parameters.shortcuts = new shortcuts();
        }

        let handleClick = this.parameters.functions.handleClick;
        let handleKeyDown = this.parameters.functions.handleKeyDown;
        let handleKeyUp = this.parameters.functions.handleKeyUp;
        let handleMouseDown = this.parameters.functions.handleMouseDown
        let handleMouseUp = this.parameters.functions.handleMouseUp;
        let handleMouseMove = this.parameters.functions.handleMouseMove;
        let handleContextMenu = this.parameters.functions.handleContextMenu;

        var canvas = <HTMLCanvasElement> document.getElementById(this.parameters.canvas);

        canvas.addEventListener('click', function(e) { handleClick(e); });
        canvas.addEventListener('keydown', function(e) { handleKeyDown(e); });
        canvas.addEventListener('keyup', function(e) { handleKeyUp(e); });
        canvas.addEventListener('mousedown', function(e) { handleMouseDown(e); });
        canvas.addEventListener('mouseup', function(e) { handleMouseUp(e); });
        canvas.addEventListener('mousemove', function(e) { handleMouseMove(e); });
        canvas.addEventListener('contextmenu', function(e) { handleContextMenu(e); }, false);

        canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        let factor = 0.05;
        let maxWidth = canvas.parentElement.offsetWidth - canvas.parentElement.offsetWidth * factor;
        let maxHeigth = (this.parameters.heigth * this.parameters.frequencies) + (this.parameters.border * (this.parameters.frequencies + 1)) + this.parameters.margin * 2;
        
        let that = this;
        window.addEventListener('resize', function() {
            that.canvas.width = that.canvas.parentElement.offsetWidth - that.canvas.parentElement.offsetWidth * factor;
            that.canvas.height = maxHeigth;
            that.draw();
        });

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.canvas.width = maxWidth;
        this.canvas.height = maxHeigth;
    }

    draw() {
        let width = 0;
        for(let i = 0; i <= this.measures.length - 1; i++) {
            let pulses = this.measures[i].pulses * this.measures[i].rhythm;

            width += (pulses * this.parameters.width) + (pulses * this.parameters.border) + this.parameters.margin + this.parameters.separation;
        }

        this.context = this.canvas.getContext("2d");

        this.context.beginPath();

        let x = this.parameters.margin;
        let y = this.parameters.margin;

        for (let i = 0; i <= this.measures.length - 1; i++) {            
            this.context.moveTo(x, y);

            // x
            for(let w = 0; w <= this.parameters.frequencies; w++) {
                let line = w == 0 ? 0 : this.parameters.border;

                for (let z = 0; z <= this.parameters.border; z++) {
                    this.context.moveTo(x, y + (this.parameters.heigth + line) * w + z);
                    this.context.lineTo(x + (this.parameters.width * this.measures[i].pulses * this.measures[i].rhythm) + (this.parameters.border * this.measures[i].pulses * this.measures[i].rhythm) + this.parameters.border, y + (this.parameters.heigth + line) * w + z);
                }
            }
            
            // y
            for(let w = 0; w <= this.measures[i].pulses * this.measures[i].rhythm; w++) {
                let line = w == 0 ? 0 : this.parameters.border;

                for (let z = 0; z <= this.parameters.border; z++) {
                    this.context.moveTo(x + (this.parameters.width + line) * w + z, y);
                    this.context.lineTo(x + (this.parameters.width + line) * w + z, y + (this.parameters.heigth * this.parameters.frequencies) + (this.parameters.border * (this.parameters.frequencies + 1)));
                }
            }

            x += this.parameters.margin + (this.parameters.width * this.measures[i].pulses * this.measures[i].rhythm) + (this.parameters.border * this.measures[i].pulses * this.measures[i].rhythm) + this.parameters.separation;
        }

        this.context.strokeStyle = this.parameters.borderColor;
        this.context.stroke();
        this.context.closePath();
    }

    getBlocksMap() {
        var widthSeparation = 0;
        var widthPulse = 0;
        var heightPulse = 0;
        
        if (map.length == 0) {
            for(var i = 0; i <= measures - 1; i++) {
                heightPulse = 0;
                var aux = 0;
                for(var x = 0; x <= frequencies - 1; x++) {
                    var yOfPulsesPixel = margin + border + heightPulse;
                    for(var y = 0; y <= pulses - 1; y++) {
                        var xOfPulsesPixel = margin + border + widthPulse + widthSeparation;
                        
                        widthPulse += border + width;
                        
                        map.push([xOfPulsesPixel, yOfPulsesPixel, width, heigth]);
                    }
                    widthPulse = 0;
                    heightPulse += border + heigth;
                }
                
                widthSeparation += widthPerMeasure + margin + separation;
            }
        }

        return map;
    }

    getMeasuresMap() {

    }
}