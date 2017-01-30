//return
// c3   - null  - d4    - null
// null - d1    - d5    - d6

class Billy {
    canvas: HTMLCanvasElement;
    configuration: Configuration;
    measures: Array<Measure> = new Array<Measure>();
    blocks: Array<Block> = new Array<Block>();
    pressed: number[] = [];

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
        _measures: Array<Measure>
    ) {
        this.measures = _measures;

        this.configuration = new Configuration(
            _configuration.selector,
            _configuration.frequencies,
            _configuration.margin, 
            _configuration.width, 
            _configuration.heigth, 
            _configuration.border, 
            _configuration.separation, 
            _configuration.printedColor,
            _configuration.selectedColor,
            _configuration.backgroundColor,
            _configuration.shortcuts);

        if (this.configuration.shortcuts == null) {
            this.configuration.shortcuts = new Shortcuts(null, null, null, null, null, null, null, null, null, null, null, null);
        }

        this.canvas = <HTMLCanvasElement> document.getElementById(this.configuration.selector);

        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.canvas.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.canvas.addEventListener('mousewheel', this.handleMouseWheel.bind(this));

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

        // ugly.. but fast enough
        for (let i = 0; i <= this.blocks.length - 1; i++) {
            newBlocks[i].printed = this.blocks[i].printed;
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

        let hexa = "#" + ("000000" + rgb).slice(-6);

        return hexa;
    }

    measure(x, y): Measure {
        // let's find x's measure
        let marginAndBorder = this.configuration.margin + this.configuration.border;
        let widthAndBorder = this.configuration.width + this.configuration.border;
        let marginAndSeparation = this.configuration.margin + this.configuration.separation;

        let heigthFrequencies = marginAndBorder;
        
        let xablau: number = 0;

        for (let i = 0; i <= this.measures.length - 1; i++) {
            let measure = this.measures[i];

            let pulsesTimesRhythm = measure.pulses * measure.rhythm;
            let beginingOfMeasure = xablau + marginAndBorder;

            // margin or separation
            if (x < beginingOfMeasure) {
                return null;
            }

            for (let w = 0; w <= pulsesTimesRhythm - 1; w++) {
                widthPulses += widthAndBorder;
            }

            xablau += (pulsesTimesRhythm * this.configuration.width) + ((pulsesTimesRhythm * this.configuration.border)) + marginAndSeparation;
        }
    }

    draw(): void {
        let context = this.canvas.getContext("2d");

        let canvasWidthAndWidth = this.canvas.width + this.configuration.width;
        let canvasHeigthAndHeigth = this.canvas.height + this.configuration.heigth;
        let inversedWidth = this.configuration.width * -1
        let inversedHeigth = this.configuration.heigth * -1;

        this.blocks = this.map();

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let block of this.blocks) {
            let outX = block.x < inversedWidth || block.x > canvasWidthAndWidth;
            let outY = block.y < inversedHeigth || block.y > canvasHeigthAndHeigth;

            if (outX || outY) {
                continue;
            }

            if (block.selected) {
                context.fillStyle = this.configuration.selectedColor;
            }
            else if (block.printed) {
                context.fillStyle = this.configuration.printedColor;
            } 
            else {
                context.fillStyle = this.configuration.backgroundColor;
            }
            
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    ///////////////
    // BEHAVIORS //
    ///////////////
    behaviorDragging(e): void {
        if (!this.isShortcutDragging()) {
            return;
        }

        var rect = this.canvas.getBoundingClientRect();    

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let newX = x - this.mouseX;
        let newY = x - this.mouseY;

        this.offsetX += newX * -1;
        this.offsetY += 0;

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

    behaviorPrinting(e): void {
        if (!this.isShortcutPrinting()) {
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

                        if (block.printed) {
                            context.fillStyle = this.configuration.backgroundColor;
                        } else {
                            context.fillStyle = this.configuration.printedColor;
                        }
                        
                        block.printed = !block.printed;

                        // if it's not printed anymore, it's not selected either
                        if (!block.printed) {
                            block.selected = false;
                        }

                        context.fillRect(xofBlock, yofBlock, this.configuration.width, this.configuration.heigth);

                        break;
                    }
                }
            }
        }
    }

    behaviorSelecting(e): void {
        if (!this.isShortcutSelecting()) {
            return;
        }

        let context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.draw();

        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        context.beginPath();

        context.moveTo(this.mouseX, this.mouseY);
        context.lineTo(x, this.mouseY);

        context.moveTo(x, this.mouseY);
        context.lineTo(x, y);

        context.moveTo(this.mouseX, this.mouseY);
        context.lineTo(this.mouseX, y);

        context.moveTo(this.mouseX, y);
        context.lineTo(x, y);

        context.closePath();
        context.strokeStyle = this.configuration.backgroundColor;
        context.stroke();

        context.fillStyle = 'rgba(225, 225, 225, 0.3)';
        context.fillRect(this.mouseX, this.mouseY, x - this.mouseX, y - this.mouseY);

        // selection can go upside down sometimes, we must have fixed coordinates
        let smallestX = this.mouseX > x ? x : this.mouseX;
        let smallestY = this.mouseY > y ? y : this.mouseY;

        let largestX = this.mouseX < x ? x : this.mouseX;
        let largestY = this.mouseY < y ? y : this.mouseY;
        
        
        let isBlockWithin = function(x, y): boolean {
            if (x > smallestX && x < largestX) {
                if (y > smallestY && y < largestY) {
                    return true;
                }
            }

            return false;
        };

        let isSelectionWithin = function(nw, ne, se, sw) {
            if (smallestX > nw.x && smallestX < ne.x) {
                if (smallestY > nw.y && smallestY < sw.y) {
                    return true;
                }
            }

            if (largestX > nw.x && largestX < ne.x) {
                if (smallestY > nw.y && smallestY < sw.y) {
                    return true;
                }
            }

            if (smallestX > nw.x && smallestX < ne.x) {
                if (largestY > nw.y && largestY < sw.y) {
                    return true;
                }
            }

            if (largestX > nw.x && largestX < ne.x) {
                if (largestY > nw.y && largestY < sw.y) {
                    return true;
                }
            }

            return false;
        }

        let isCrossingThrough = function(nw, ne, se, sw): boolean {
            if (smallestX < nw.x && largestX > nw.x) {
                if (smallestY > nw.y && largestY < sw.y) {
                    return true;
                }
            }

            if (smallestY < nw.y && largestY > nw.y) {
                if (smallestX > nw.x && largestX < ne.x) {
                    return true;
                }
            }

            return false;
        };

        // let's check if block's corners are within selection
        for (let block of this.blocks) {
            block.selected = false;

            // only printed blocks can be selected
            if (!block.printed) {
                continue;
            }

            let nw = {
                x: block.x,
                y: block.y
            };

            let se = {
                x: block.x + block.width,
                y: block.y + block.height
            };

            let ne = {
                x: block.x + block.width,
                y: block.y
            };

            let sw = {
                x: block.x,
                y: block.y + block.height
            };

            if(isBlockWithin(nw.x, nw.y)) {
                block.selected = true;
                continue;
            }

            if(isBlockWithin(ne.x, ne.y)) {
                block.selected = true;
                continue;
            }

            if(isBlockWithin(se.x, se.y)) {
                block.selected = true;
                continue;
            }

            if(isBlockWithin(sw.x, sw.y)) {
                block.selected = true;
                continue;
            }

            // if none of block's corners are within selection, maybe selection is within block
            if (isSelectionWithin(nw, ne, se, sw)) {
                block.selected = true;
                continue;
            }

            // or maybe selections is crossing blocks without touching north and south, or, east and west
            if (isCrossingThrough(nw, ne, se, sw)) {
                block.selected = true;
                continue;
            }
        }
    }

    behaviorShortcut(e): void {
        
    }

    /////////////////////
    // HANDLING EVENTS //
    /////////////////////
    handleMouseWheel(e): void {
        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let oldMeasure: Measure = this.measure(x, y);

        // click was at margin or separation
        if (oldMeasure == undefined) {
            return;
        }

        let newRhythm: number;
        let newPulse: number;

        if (this.isShortcutRhythmChanging()) {
            if (e.deltaY < 0) {
                // going up
                newRhythm = oldMeasure.rhythm + 1;
                newPulse = oldMeasure.pulses;
            }
            else {
                // going down
                newRhythm = oldMeasure.rhythm - 1;
                newPulse = oldMeasure.pulses;
            }
            
            // 2 - third-second note
            // 3 - sixteenth note
            // 4 - eighth note
            // 5 - quarter note
            // 6 - half note
            // 7 - whole note
            if (newRhythm > 7) {
                newRhythm == 7;
            }

            if (newRhythm < 2) { 
                newRhythm == 2;
            }
        }
        else if (this.isShortcutPulseChanging()) {
            if (e.deltaY < 0) {
                // going up
                newRhythm = oldMeasure.rhythm;
                newPulse = oldMeasure.pulses + 1;
            }
            else {
                // going down
                newRhythm = oldMeasure.rhythm;
                newPulse = oldMeasure.pulses - 1;
            }
            
            // 2 - 2/x measure
            // 3 - 3/x measure
            // 4 - 4/x measure
            // 5 - 5/x measure
            // 6 - 6/x measure
            // 7 - 7/x measure
            if (newPulse > 7) {
                newPulse == 7;
            }

            if (newPulse < 2) { 
                newPulse == 2;
            }
        }
        else {
            return;
        }

        this.draw();
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
        
        let index = this.pressed.indexOf(e.which);

        if (index < 0) {
            this.pressed.push(e.which);

            // always sort array in ascending order
            this.pressed = this.pressed.sort(function (a, b) { 
                return a - b; 
            });
        }
    }

    handleKeyUp(e): void {
        e.preventDefault();
        e.stopPropagation();

        let was = false;
        if (this.isShortcutSelecting()) {
            was = true;
        }

        let index = this.pressed.indexOf(e.which);

        if (index > -1) {
            this.pressed.splice(index);

            // if it was selecting, but it's not anymore
            // we must remove selection from canvas
            if (was) {
                if (!this.isShortcutSelecting()) {
                    this.draw();
                }
            }
        }
    }

    handleMouseDown(e): void {
        let rect = this.canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        this.mouseX = x; 
        this.mouseY = y;

        switch (e.which) {
            case 1:
            default: 
                this.mouseLeftButtonClicked = true;
                this.mouseRightButtonClicked = false;
                this.mouseMiddleButtonClicked = false;

                if (!this.isShortcutSelecting()) {
                    this.behaviorPrinting(e);
                }
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
        }
    }

    handleMouseUp(e): void {
        e.preventDefault();
        e.stopPropagation();

        // to remove any selections
        this.draw();

        this.mouseLeftButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.mouseRightButtonClicked = false;
    }

    handleMouseMove(e): void {
        e.preventDefault();
        e.stopPropagation();

        if (this.isShortcutSelecting() && this.mouseLeftButtonClicked) {
            this.behaviorSelecting(e);
        }
        else if (this.mouseLeftButtonClicked) {
            let rect = this.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            let oldColor = this.color(this.mouseX, this.mouseY);
            
            this.mouseX = x; 
            this.mouseY = y;

            let newColor = this.color(this.mouseX, this.mouseY);

            if (oldColor != newColor) {
                this.behaviorPrinting(e);
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
        
        // to remove any selections
        this.draw();

        this.mouseLeftButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.mouseRightButtonClicked = false;
    }

    /////////////////////
    // SHORTCUT CHECKS //
    /////////////////////
    isShortcutPrinting(): boolean {
        return this.mouseLeftButtonClicked;
    }

    isShortcutDragging(): boolean {
        return this.mouseRightButtonClicked;
    }

    isShortcutSelecting(): boolean {
        if (this.configuration.shortcuts.selection.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.selection.length - 1; i++) {
            if (this.configuration.shortcuts.selection[i] != this.pressed[i]) { 
                return false
            }
        }

        return true;
    }

    isShortcutRhythmChanging(): boolean {
        if (this.configuration.shortcuts.rhythmChange.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.rhythmChange.length - 1; i++) {
            if (this.configuration.shortcuts.rhythmChange[i] == this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutPulseChanging(): boolean {
        if (this.configuration.shortcuts.pulsesChange.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.pulsesChange.length - 1; i++) {
            if (this.configuration.shortcuts.pulsesChange[i] == this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutMovingUp(): boolean {
        if (this.configuration.shortcuts.movingSelectionUp.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.movingSelectionUp.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionUp[i] != this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutMovingRight(): boolean {
        if (this.configuration.shortcuts.movingSelectionRight.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.movingSelectionRight.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionRight[i] != this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }
    
    isShortcutMovingDown(): boolean {
        if (this.configuration.shortcuts.movingSelectionDown.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.movingSelectionDown.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionDown[i] != this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutMovingLeft(): boolean {
        if (this.configuration.shortcuts.movingSelectionLeft.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.movingSelectionLeft.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionLeft[i] != this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutPastingUp(): boolean {
        if (this.configuration.shortcuts.pastingSelectionUp.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.pastingSelectionUp.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionUp[i] != this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutPastingRight(): boolean {
        if (this.configuration.shortcuts.pastingSelectionRight.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.pastingSelectionRight.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionRight[i] != this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutPastingDown(): boolean {
        if (this.configuration.shortcuts.pastingSelectionDown.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.pastingSelectionDown.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionDown[i] == this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }

    isShortcutPastingLeft(): boolean {
        if (this.configuration.shortcuts.pastingSelectionLeft.length != this.pressed.length) {
            return false;
        }

        for (let i = 0; i <= this.configuration.shortcuts.pastingSelectionLeft.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionLeft[i] == this.pressed[i]) { 
                return false;
            }
        }

        return true;
    }
}