//return
// c3   - null  - d4    - null
// null - d1    - d5    - d6
var Billy = (function () {
    function Billy(_configuration, _measures) {
        this.measures = new Array();
        this.blocks = new Array();
        this.pressed = [];
        this.mouseLeftButtonClicked = false;
        this.mouseRightButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.widthMeasures = 0;
        this.heigthMeasures = 0;
        this.measures = _measures;
        this.configuration = new Configuration(_configuration.selector, _configuration.frequencies, _configuration.margin, _configuration.width, _configuration.heigth, _configuration.border, _configuration.separation, _configuration.printedColor, _configuration.selectedColor, _configuration.backgroundColor, _configuration.shortcuts);
        if (this.configuration.shortcuts == null) {
            this.configuration.shortcuts = new Shortcuts(null, null, null, null, null, null, null, null, null, null);
        }
        this.canvas = document.getElementById(this.configuration.selector);
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
    Billy.prototype.map = function () {
        // That's how the matrix is turned into a array
        // ------------------------------ ---------------- --------
        // --  1  --  4  --  7  --  10 -- --  13 --  16 -- -- 19 --
        // ------------------------------ ---------------- --------
        // --  2  --  5  --  8  --  11 -- --  14 --  17 -- -- 20 --
        // ------------------------------ ---------------- --------
        // --  3  --  6  --  9  --  12 -- --  15 --  18 -- -- 21 --
        // ------------------------------ ---------------- --------
        this.widthMeasures = 0;
        var newBlocks = new Array();
        var marginAndBorder = this.configuration.margin + this.configuration.border;
        var widthAndBorder = this.configuration.width + this.configuration.border;
        var heigthAndBorder = this.configuration.heigth + this.configuration.border;
        var marginAndSeparation = this.configuration.margin + this.configuration.separation;
        var heigthFrequencies = marginAndBorder;
        for (var i = 0; i <= this.measures.length - 1; i++) {
            var measure = this.measures[i];
            var pulsesTimesRhythm = measure.pulses * measure.rhythm;
            var widthPulses = this.widthMeasures + marginAndBorder;
            for (var w = 0; w <= pulsesTimesRhythm - 1; w++) {
                newBlocks.push(new Block(widthPulses - this.offsetX, heigthFrequencies - this.offsetY, this.configuration.width, this.configuration.heigth));
                for (var z = 1; z <= this.configuration.frequencies - 1; z++) {
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
        for (var i = 0; i <= this.blocks.length - 1; i++) {
            newBlocks[i].printed = this.blocks[i].printed;
            newBlocks[i].selected = this.blocks[i].selected;
        }
        this.blocks = newBlocks;
        // Because we don't have a separation in the end
        this.widthMeasures = this.widthMeasures - this.configuration.separation;
        return this.blocks;
    };
    Billy.prototype.color = function (x, y) {
        var context = this.canvas.getContext("2d");
        var data = context.getImageData(x, y, 1, 1).data;
        var rgb = ((data[0] << 16) | (data[1] << 8) | data[2]).toString(16);
        var hexa = "#" + ("000000" + rgb).slice(-6);
        return hexa;
    };
    Billy.prototype.draw = function () {
        var context = this.canvas.getContext("2d");
        var canvasWidthAndWidth = this.canvas.width + this.configuration.width;
        var canvasHeigthAndHeigth = this.canvas.height + this.configuration.heigth;
        var inversedWidth = this.configuration.width * -1;
        var inversedHeigth = this.configuration.heigth * -1;
        this.blocks = this.map();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var _i = 0, _a = this.blocks; _i < _a.length; _i++) {
            var block = _a[_i];
            var outX = block.x < inversedWidth || block.x > canvasWidthAndWidth;
            var outY = block.y < inversedHeigth || block.y > canvasHeigthAndHeigth;
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
    };
    Billy.prototype.behaviorDragging = function (e) {
        if (!this.isShortcutDragging()) {
            return;
        }
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var newX = x - this.mouseX;
        var newY = x - this.mouseY;
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
        var context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
    };
    Billy.prototype.behaviorPrinting = function (e) {
        if (!this.isShortcutPrinting()) {
            return;
        }
        var sorted = this.map().slice(0).sort(function (a, b) {
            if (a.x > b.x) {
                return 1;
            }
            else if (a.x < b.x) {
                return -1;
            }
            if (a.y < b.y) {
                return -1;
            }
            else if (a.y > b.y) {
                return 1;
            }
            return 0;
        });
        var length = Object.keys(sorted).length;
        // group object by x axis, if click was before this axis
        // we don't need to check other blocks with the same x axis.
        var grouping = {};
        for (var i = 0; i <= length - 1; i++) {
            var block = sorted[i];
            if (grouping[block.y] === undefined) {
                grouping[block.y] = [block.y];
                grouping[block.y].pop();
                grouping[block.y].push(block.x);
            }
            else {
                grouping[block.y].push(block.x);
            }
        }
        var exit = false;
        // let's find out clicked block
        // this may be improved
        for (var i = 0; i <= length - 1; i++) {
            if (exit) {
                break;
            }
            var key = Object.keys(grouping)[i];
            var yofBlock = +key;
            // we don't have to handle blocks not written in the canvas
            if (yofBlock < this.offsetY * -1) {
                continue;
            }
            // click was in border or in margin
            if (this.mouseY < yofBlock) {
                continue;
            }
            // must check if click was in range of a block
            if (yofBlock - this.offsetY <= this.mouseY && this.mouseY < yofBlock + this.configuration.heigth) {
                var xs = grouping[key];
                for (var w = 0; w <= xs.length; w++) {
                    var xofBlock = xs[w];
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
                        var context = this.canvas.getContext("2d");
                        var index = this.blocks.map(function (block) {
                            return block.x.toString() + '-' + block.y;
                        }).indexOf(xofBlock.toString() + '-' + yofBlock.toString());
                        var block = this.blocks[index];
                        if (block.printed) {
                            context.fillStyle = this.configuration.backgroundColor;
                        }
                        else {
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
    };
    Billy.prototype.behaviorSelecting = function (e) {
        if (!this.isShortcutSelecting()) {
            return;
        }
        var context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
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
        var smallestX = this.mouseX > x ? x : this.mouseX;
        var smallestY = this.mouseY > y ? y : this.mouseY;
        var largestX = this.mouseX < x ? x : this.mouseX;
        var largestY = this.mouseY < y ? y : this.mouseY;
        var isBlockWithin = function (x, y) {
            if (x > smallestX && x < largestX) {
                if (y > smallestY && y < largestY) {
                    return true;
                }
            }
            return false;
        };
        var isSelectionWithin = function (nw, ne, se, sw) {
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
        };
        var isCrossingThrough = function (nw, ne, se, sw) {
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
        for (var _i = 0, _a = this.blocks; _i < _a.length; _i++) {
            var block = _a[_i];
            block.selected = false;
            // only printed blocks can be selected
            if (!block.printed) {
                continue;
            }
            var nw = {
                x: block.x,
                y: block.y
            };
            var se = {
                x: block.x + block.width,
                y: block.y + block.height
            };
            var ne = {
                x: block.x + block.width,
                y: block.y
            };
            var sw = {
                x: block.x,
                y: block.y + block.height
            };
            if (isBlockWithin(nw.x, nw.y)) {
                block.selected = true;
                continue;
            }
            if (isBlockWithin(ne.x, ne.y)) {
                block.selected = true;
                continue;
            }
            if (isBlockWithin(se.x, se.y)) {
                block.selected = true;
                continue;
            }
            if (isBlockWithin(sw.x, sw.y)) {
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
    };
    Billy.prototype.behaviorShortcut = function (e) {
    };
    Billy.prototype.handleMouseWheel = function (e) {
    };
    Billy.prototype.handleResizing = function (e) {
        var maxWidth = this.canvas.parentElement.offsetWidth - this.canvas.parentElement.offsetWidth * 0.05;
        var maxHeigth = (this.configuration.heigth * this.configuration.frequencies) + (this.configuration.border * (this.configuration.frequencies + 1)) + this.configuration.margin * 2;
        this.offsetX = 0;
        this.offsetY = 0;
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeigth;
        this.draw();
    };
    Billy.prototype.handleKeyDown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var index = this.pressed.indexOf(e.which);
        if (index < 0) {
            this.pressed.push(e.which);
            // always sort array in ascending order
            this.pressed = this.pressed.sort(function (a, b) {
                return a - b;
            });
        }
    };
    Billy.prototype.handleKeyUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var was = false;
        if (this.isShortcutSelecting()) {
            was = true;
        }
        var index = this.pressed.indexOf(e.which);
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
    };
    Billy.prototype.handleMouseDown = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
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
    };
    Billy.prototype.handleMouseUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
        // to remove any selections
        this.draw();
        this.mouseLeftButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.mouseRightButtonClicked = false;
    };
    Billy.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.isShortcutSelecting() && this.mouseLeftButtonClicked) {
            this.behaviorSelecting(e);
        }
        else if (this.mouseLeftButtonClicked) {
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var oldColor = this.color(this.mouseX, this.mouseY);
            this.mouseX = x;
            this.mouseY = y;
            var newColor = this.color(this.mouseX, this.mouseY);
            if (oldColor != newColor) {
                this.behaviorPrinting(e);
            }
        }
        else if (this.mouseRightButtonClicked) {
            this.behaviorDragging(e);
        }
        else {
        }
    };
    Billy.prototype.handleMouseOut = function (e) {
        e.preventDefault();
        e.stopPropagation();
        // to remove any selections
        this.draw();
        this.mouseLeftButtonClicked = false;
        this.mouseMiddleButtonClicked = false;
        this.mouseRightButtonClicked = false;
    };
    Billy.prototype.isShortcutPrinting = function () {
        return this.mouseLeftButtonClicked;
    };
    Billy.prototype.isShortcutDragging = function () {
        return this.mouseRightButtonClicked;
    };
    Billy.prototype.isShortcutSelecting = function () {
        if (this.configuration.shortcuts.selection.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.selection.length - 1; i++) {
            if (this.configuration.shortcuts.selection[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutMovingUp = function () {
        if (this.configuration.shortcuts.movingSelectionUp.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.movingSelectionUp.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionUp[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutMovingRight = function () {
        if (this.configuration.shortcuts.movingSelectionRight.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.movingSelectionRight.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionRight[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutMovingDown = function () {
        if (this.configuration.shortcuts.movingSelectionDown.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.movingSelectionDown.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionDown[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutMovingLeft = function () {
        if (this.configuration.shortcuts.movingSelectionLeft.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.movingSelectionLeft.length - 1; i++) {
            if (this.configuration.shortcuts.movingSelectionLeft[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutPastingUp = function () {
        if (this.configuration.shortcuts.pastingSelectionUp.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.pastingSelectionUp.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionUp[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutPastingRight = function () {
        if (this.configuration.shortcuts.pastingSelectionRight.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.pastingSelectionRight.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionRight[i] != this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutPastingDown = function () {
        if (this.configuration.shortcuts.pastingSelectionDown.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.pastingSelectionDown.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionDown[i] == this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    Billy.prototype.isShortcutPastingLeft = function () {
        if (this.configuration.shortcuts.pastingSelectionLeft.length != this.pressed.length) {
            return false;
        }
        for (var i = 0; i <= this.configuration.shortcuts.pastingSelectionLeft.length - 1; i++) {
            if (this.configuration.shortcuts.pastingSelectionLeft[i] == this.pressed[i]) {
                return false;
            }
        }
        return true;
    };
    return Billy;
}());
var Block = (function () {
    function Block(_x, _y, _width, _height) {
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.printed = false;
        this.selected = false;
    }
    return Block;
}());
var Configuration = (function () {
    function Configuration(_selector, _frequencies, _margin, _width, _heigth, _border, _separation, _printedColor, _selectedColor, _backgroundColor, _shortcuts) {
        if (_selector == undefined) {
            this.selector = "canvas";
        }
        else {
            this.selector = _selector;
        }
        if (_frequencies == undefined) {
            this.frequencies = 7;
        }
        else {
            this.frequencies = _frequencies;
        }
        if (_margin == undefined) {
            this.margin = 5;
        }
        else {
            this.margin = _margin;
        }
        if (_width == undefined) {
            this.width = 40;
        }
        else {
            this.width = _width;
        }
        if (_heigth == undefined) {
            this.heigth = 25;
        }
        else {
            this.heigth = _heigth;
        }
        if (_border == undefined) {
            this.border = 5;
        }
        else {
            this.border = _border;
        }
        if (_separation == undefined) {
            this.separation = 10;
        }
        else {
            this.separation = _separation;
        }
        if (_printedColor == undefined) {
            this.printedColor = '#CCC23F';
        }
        else {
            this.printedColor = _printedColor;
        }
        if (_selectedColor == undefined) {
            this.selectedColor = '#CA504C';
        }
        else {
            this.selectedColor = _selectedColor;
        }
        if (_backgroundColor == undefined) {
            this.backgroundColor = '#3582BF';
        }
        else {
            this.backgroundColor = _backgroundColor;
        }
        if (_shortcuts == undefined) {
            this.shortcuts = new Shortcuts(null, null, null, null, null, null, null, null, null, null);
        }
        else {
            this.shortcuts = new Shortcuts(_shortcuts.selection, _shortcuts.removeSelection, _shortcuts.movingSelectionUp, _shortcuts.movingSelectionRight, _shortcuts.movingSelectionDown, _shortcuts.movingSelectionLeft, _shortcuts.pastingSelectionUp, _shortcuts.pastingSelectionRight, _shortcuts.pastingSelectionDown, _shortcuts.pastingSelectionLeft);
        }
    }
    return Configuration;
}());
var Measure = (function () {
    function Measure(_pulses, _rhythm) {
        if (_pulses == undefined) {
            this.pulses = 4;
        }
        else {
            this.pulses = _pulses;
        }
        if (_rhythm == undefined) {
            this.rhythm = 1;
        }
        else {
            this.rhythm = _rhythm;
        }
    }
    return Measure;
}());
var Shortcuts = (function () {
    function Shortcuts(_selection, _removeSelection, _rhythmChange, _pulsesChange, _movingSelectionUp, _movingSelectionRight, _movingSelectionDown, _movingSelectionLeft, _pastingSelectionUp, _pastingSelectionRight, _pastingSelectionDown, _pastingSelectionLeft) {
        if (_selection == undefined) {
            this.selection = [16];
        }
        else {
            this.selection = _selection;
        }
        if (_removeSelection == undefined) {
            this.removeSelection = [27];
        }
        else {
            this.removeSelection = _removeSelection;
        }
        if (_rhythmChange == undefined) {
            this.rhythmChange = [16];
        }
        else {
            this.rhythmChange = _rhythmChange;
        }
        if (_pulsesChange == undefined) {
            this.pulsesChange = [17];
        }
        else {
            this.pulsesChange = _pulsesChange;
        }
        if (_movingSelectionUp == undefined) {
            this.movingSelectionUp = [38];
        }
        else {
            this.movingSelectionUp = _movingSelectionUp;
        }
        if (_movingSelectionRight == undefined) {
            this.movingSelectionRight = [39];
        }
        else {
            this.movingSelectionRight = _movingSelectionRight;
        }
        if (_movingSelectionDown == undefined) {
            this.movingSelectionDown = [40];
        }
        else {
            this.movingSelectionDown = _movingSelectionDown;
        }
        if (_movingSelectionLeft == undefined) {
            this.movingSelectionLeft = [37];
        }
        else {
            this.movingSelectionLeft = _movingSelectionLeft;
        }
        if (_pastingSelectionUp == undefined) {
            this.pastingSelectionUp = [16, 17, 38];
        }
        else {
            this.pastingSelectionUp = _pastingSelectionUp;
        }
        if (_pastingSelectionRight == undefined) {
            this.pastingSelectionRight = [16, 17, 39];
        }
        else {
            this.pastingSelectionRight = _pastingSelectionRight;
        }
        if (_pastingSelectionDown == undefined) {
            this.pastingSelectionDown = [16, 17, 40];
        }
        else {
            this.pastingSelectionDown = _pastingSelectionDown;
        }
        if (_pastingSelectionLeft == undefined) {
            this.pastingSelectionLeft = [16, 17, 37];
        }
        else {
            this.pastingSelectionLeft = _pastingSelectionLeft;
        }
    }
    return Shortcuts;
}());
