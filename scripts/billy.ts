class Billy {
    canvas : HTMLCanvasElement;
    configuration : Configuration;
    measures : Array<Measure>;
    blocks: Array<Block> = new Array<Block>();
    pressed: Array<number> = new Array<number>();

    isDragging: boolean = false;
    isClicking: boolean = false;

    mouseLeftButtonClicked: boolean = false;
    mouseRightButtonClicked: boolean = false;
    mouseMiddleButtonClicked: boolean = false;

    offsetX: number = 0;
    offsetY: number = 0;
    mouseX: number;
    mouseY: number;

    widthMeasures: number = 0;
    heigthMeasures: number = 0;

    constructor(
        _configuration: Configuration, 
        _measures: Array<Measure>) 
    {
        this.measures = _measures;

        this.configuration = new Configuration(
            _configuration.selector,
            _configuration.frequencies,
            _configuration.margin, 
            _configuration.width, 
            _configuration.heigth, 
            _configuration.border, 
            _configuration.separation, 
            _configuration.selectedColor, 
            _configuration.backgroundColor,
            _configuration.sensibility,
            _configuration.shortcuts);

        if (this.configuration.shortcuts == null) {
            this.configuration.shortcuts = new Shortcuts(null, null, null, null, null, null, null);
        }

        this.canvas = <HTMLCanvasElement> document.getElementById(this.configuration.selector);
        
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.canvas.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        window.addEventListener('resize', this.handleResizing.bind(this));

        this.handleResizing(new Event('build'));
    }

    map(): Array<Block> {
        // That's how the matrix is turned into a array
        // ------------------------------ ---------------- --------
        // --  1  --  4  --  7  --  10 -- --  13 --  16 -- -- 19 --
        // ------------------------------ ---------------- --------
        // --  2  --  5  --  8  --  11 -- --  14 --  17 -- -- 20 --
        // ------------------------------ ---------------- --------
        // --  3  --  6  --  9  --  12 -- --  15 --  18 -- -- 21 --
        // ------------------------------ ---------------- --------
        this.widthMeasures = 0;

        let newBlocks = new Array<Block>();

        let marginAndBorder = this.configuration.margin + this.configuration.border;
        let widthAndBorder = this.configuration.width + this.configuration.border;
        let heigthAndBorder = this.configuration.heigth + this.configuration.border;
        let marginAndSeparation = this.configuration.margin + this.configuration.separation;

        let heigthFrequencies = marginAndBorder;
        
        for (let i = 0; i <= this.measures.length - 1; i++) {
            let measure = this.measures[i];

            let pulsesTimesRhythm = measure.pulses * measure.rhythm;
            let widthPulses = this.widthMeasures + marginAndBorder;

            for (let w = 0; w <= pulsesTimesRhythm - 1; w++) {
                newBlocks.push(new Block(widthPulses - this.offsetX, heigthFrequencies - this.offsetY, this.configuration.width, this.configuration.heigth));

                for (let z = 1; z <= this.configuration.frequencies - 1; z++) {
                    heigthFrequencies += heigthAndBorder;

                    newBlocks.push(new Block(widthPulses - this.offsetX, heigthFrequencies - this.offsetY, this.configuration.width, this.configuration.heigth));
                }

                widthPulses += widthAndBorder;
                heigthFrequencies = marginAndBorder;
            }

            heigthFrequencies = marginAndBorder;

            this.widthMeasures += (pulsesTimesRhythm * this.configuration.width) + ((pulsesTimesRhythm * this.configuration.border)) + marginAndSeparation;
        }

        for (let i = 0; i <= this.blocks.length - 1; i++) {
            newBlocks[i].selected = this.blocks[i].selected;
        }

        this.blocks = newBlocks;
        
        // Because we don't have a separation in the end
        this.widthMeasures = this.widthMeasures - this.configuration.separation;

        return this.blocks;
    }

    color(x, y): string {
        let context = this.canvas.getContext("2d");

        let data = context.getImageData(x, y, 1, 1).data;

        let rgb = ((data[0] << 16) | (data[1] << 8) | data[2]).toString(16);

        let hexadecimal = "#" + ("000000" + rgb).slice(-6);

        return hexadecimal;
    }

    direction(oldX, oldY, newX, newY): number {
        if (oldY < newY) {
            // it's going up
            return 1;
        }
        else if (oldX > newX) {
            // through the right
            return 2
        }
        else if (oldY > newY) {
            // now it's going down
            return 3;
        }
        else if (oldX < newX) {
            // and then left
            return 4;
        }
        else {
            // it stayed still
            return 0;
        }
    }

    draw(): void {
        let context = this.canvas.getContext("2d");

        let canvasWidthAndWidth = this.canvas.width + this.configuration.width;
        let canvasHeigthAndHeigth = this.canvas.height + this.configuration.heigth;
        let inversedWidth = this.configuration.width * -1
        let inversedHeigth = this.configuration.heigth * -1;

        this.blocks = this.map();

        for (let block of this.blocks) {
            let outX = block.x < inversedWidth || block.x > canvasWidthAndWidth;
            let outY = block.y < inversedHeigth || block.y > canvasHeigthAndHeigth;

            if (outX || outY) {
                continue;
            }

            if (block.selected) {
                context.fillStyle = this.configuration.selectedColor;
            } else {
                context.fillStyle = this.configuration.backgroundColor;
            }

            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    behaviorDragging(e): void {
        if (!this.isDragging) {
            return;
        }

        var rect = this.canvas.getBoundingClientRect();    

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let newX = x - this.mouseX;
        let newY = x - this.mouseY;

        this.offsetX += (newX - newX * this.configuration.sensibility) * -1;
        this.offsetY = 0
        // this.offsetY += (newY - newY * this.configuration.sensibility) * -1;

        this.mouseX = x; 
        this.mouseY = y;

        if (this.widthMeasures < this.canvas.width) { 
            // if sum of measures width is lesser than canvas width, we don't have to worry about offsets
            this.offsetX = 0;
        } 
        else {
            // if it's not, we can't let the draw in canvas offset forever
            if (this.offsetX > this.widthMeasures - this.canvas.width + this.configuration.margin + this.configuration.border) {
                this.offsetX = this.widthMeasures - this.canvas.width + this.configuration.margin + this.configuration.border;
            } 
            else if (this.offsetX < 1) {
                this.offsetX = 0;
            }
        }

        let context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.draw();
    }

    behaviorClicking(e): void {
        if (!this.isClicking || !this.mouseLeftButtonClicked) {
            return;
        }

        let sorted: Array<Block> = this.map().slice(0).sort(function(a, b) { 
            if (a.x > b.x) {
                return 1;
            } else if (a.x < b.x) {
                return -1;
            }

            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            }
            
            return 0;
        });

        let length = Object.keys(sorted).length;

        // group object by x axis, if click was before this axis
        // we don't need to check other blocks with the same x axis.
        let grouping = { };

        for (let i = 0; i <= length - 1; i++) {
            let block: Block = sorted[i];

            if (grouping[block.y] === undefined) {
                grouping[block.y] = [block.y];
                grouping[block.y].pop();
                grouping[block.y].push(block.x);            
            }
            else {
                grouping[block.y].push(block.x);
            }
        }

        let exit:boolean = false;

        // let's find out clicked block
        // this may be improved
        for (let i = 0; i <= length - 1; i++) {
            if (exit) {
                break;
            }

            let key = Object.keys(grouping)[i]; 

            let yofBlock:number = +key;

            // we don't have to handle blocks not written in the canvas
            if (yofBlock < this.offsetY * -1) {
                continue;
            }

            // click was in border or in margin
            if (this.mouseY < yofBlock) {
                continue;
            }
            
            // must check if click was in range of a block
            if (yofBlock - this.offsetY  <= this.mouseY && this.mouseY < yofBlock + this.configuration.heigth) {
                let xs:[number] = grouping[key];

                for (let w = 0; w <= xs.length; w++) {
                    let xofBlock:number = xs[w];

                    // we don't have to handle blocks not written in the canvas
                    if (xofBlock < this.offsetX * -1) {
                        continue;
                    }

                    // click was in border or in margin
                    if (this.mouseX < xofBlock) {
                        continue;
                    }

                    // found
                    if (xofBlock - this.offsetX <= this.mouseX && this.mouseX < xofBlock + this.configuration.width) {
                        exit = true;
                        
                        let context = this.canvas.getContext("2d");

                        var index = this.blocks.map(function (block) {
                            return block.x.toString() + '-' + block.y;
                        }).indexOf(xofBlock.toString() + '-' + yofBlock.toString());

                        let block = this.blocks[index];

                        if (block.selected) {
                            context.fillStyle = this.configuration.backgroundColor;
                        } else {
                            context.fillStyle = this.configuration.selectedColor;
                        }
                        
                        block.selected = !block.selected;

                        context.fillRect(xofBlock, yofBlock, this.configuration.width, this.configuration.heigth);

                        break;
                    }
                }
            }
        }
    }

    handleResizing(e): void {
        let maxWidth = this.canvas.parentElement.offsetWidth - this.canvas.parentElement.offsetWidth * 0.05;
        let maxHeigth = (this.configuration.heigth * this.configuration.frequencies) + (this.configuration.border * (this.configuration.frequencies + 1)) + this.configuration.margin * 2;

        this.offsetX = 0;
        this.offsetY = 0;

        this.canvas.width = maxWidth;
        this.canvas.height = maxHeigth;

        this.draw();
    }
    
    handleKeyDown(e): void {
        e.preventDefault();
        e.stopPropagation();

        this.pressed.push(e.which)
    }

    handleKeyUp(e): void {
        e.preventDefault();
        e.stopPropagation();
    }

    handleMouseDown(e): void {
        let rect = this.canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        this.mouseX = x; 
        this.mouseY = y;
        this.isDragging = true;
        this.isClicking = true;

        switch (e.which) {
            case 1:
                this.mouseLeftButtonClicked = true;
                this.mouseRightButtonClicked = false;
                this.mouseMiddleButtonClicked = false;
                this.behaviorClicking(e);
                break;
            case 2:
                this.mouseLeftButtonClicked = false;
                this.mouseRightButtonClicked = false;
                this.mouseMiddleButtonClicked = true;
                break;
            case 3:
                this.mouseLeftButtonClicked = false;
                this.mouseRightButtonClicked = true;
                this.mouseMiddleButtonClicked = false;
                break;
            default: 
                this.mouseLeftButtonClicked = true;
                this.mouseRightButtonClicked = false;
                this.mouseMiddleButtonClicked = false;
                break;
        }
    }

    handleMouseUp(e): void {
        e.preventDefault();
        e.stopPropagation();

        this.isDragging = false;
        this.isClicking = false;
        this.mouseLeftButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.mouseRightButtonClicked = false;
    }

    handleMouseMove(e): void {
        e.preventDefault();
        e.stopPropagation();

        if (this.mouseLeftButtonClicked) {
            let rect = this.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            let oldColor = this.color(this.mouseX, this.mouseY);
            
            this.mouseX = x; 
            this.mouseY = y;

            let newColor = this.color(this.mouseX, this.mouseY);

            if (oldColor != newColor) {
                this.behaviorClicking(e);
            }
        } 
        else if (this.mouseRightButtonClicked) {
            this.behaviorDragging(e);
        }
        else {
        }
    }

    handleMouseOut(e): void {
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = false;
        this.isClicking = false;
        this.mouseLeftButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.mouseRightButtonClicked = false;
    }
}