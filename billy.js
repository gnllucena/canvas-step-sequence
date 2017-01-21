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
var Billy = (function () {
    function Billy(_selector, _configuration, _measures) {
        this.blocks = new Array();
        this.pressed = new Array();
        this.isDragging = false;
        this.isClicking = false;
        this.leftButtonClicked = false;
        this.rightButtonClicked = false;
        this.middleButtonClicked = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.widthMeasures = 0;
        this.heigthMeasures = 0;
        this.measures = _measures;
        this.configuration = new Configuration(_configuration.frequencies, _configuration.margin, _configuration.width, _configuration.heigth, _configuration.border, _configuration.separation, _configuration.selectedColor, _configuration.backgroundColor, _configuration.sensibility, _configuration.shortcuts);
        if (this.configuration.shortcuts == null) {
            this.configuration.shortcuts = new Shortcuts(null, null, null, null, null, null, null);
        }
        this.canvas = document.getElementById(_selector);
        this.canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.canvas.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        var self = this;
        var resizing = function (e) {
            var maxWidth = self.canvas.parentElement.offsetWidth - self.canvas.parentElement.offsetWidth * 0.05;
            var maxHeigth = (self.configuration.heigth * self.configuration.frequencies) + (self.configuration.border * (self.configuration.frequencies + 1)) + self.configuration.margin * 2;
            self.offsetX = 0;
            self.offsetY = 0;
            self.canvas.width = maxWidth;
            self.canvas.height = maxHeigth;
            self.draw();
        };
        window.addEventListener('resize', resizing.bind(this));
        resizing(new Event('build'));
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
        for (var i = 0; i <= this.blocks.length - 1; i++) {
            newBlocks[i].selected = this.blocks[i].selected;
        }
        this.blocks = newBlocks;
        // Because we don't have a separation in the end
        this.widthMeasures = this.widthMeasures - this.configuration.separation;
        return this.blocks;
    };
    Billy.prototype.draw = function () {
        var context = this.canvas.getContext("2d");
        var canvasWidthAndWidth = this.canvas.width + this.configuration.width;
        var canvasHeigthAndHeigth = this.canvas.height + this.configuration.heigth;
        var inversedWidth = this.configuration.width * -1;
        var inversedHeigth = this.configuration.heigth * -1;
        this.blocks = this.map();
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
            else {
                context.fillStyle = this.configuration.backgroundColor;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    };
    Billy.prototype.behaviorDragging = function (e) {
        if (!this.isDragging) {
            return;
        }
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var newX = x - this.mouseX;
        var newY = x - this.mouseY;
        this.offsetX += (newX - newX * this.configuration.sensibility) * -1;
        this.offsetY = 0;
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
        var context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
    };
    Billy.prototype.behaviorClicking = function (e) {
        if (!this.isClicking || !this.leftButtonClicked) {
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
                        context.fillStyle = this.configuration.selectedColor;
                        context.fillRect(xofBlock, yofBlock, this.configuration.width, this.configuration.heigth);
                        var index = this.blocks.map(function (block) {
                            return block.x.toString() + '-' + block.y;
                        }).indexOf(xofBlock.toString() + '-' + yofBlock.toString());
                        var block = this.blocks[index];
                        block.selected = true;
                        break;
                    }
                }
            }
        }
    };
    Billy.prototype.handleKeyDown = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    Billy.prototype.handleKeyUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    Billy.prototype.handleMouseDown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.mouseX = x;
        this.mouseY = y;
        this.isDragging = true;
        this.isClicking = true;
        switch (e.which) {
            case 1:
                this.leftButtonClicked = true;
                this.rightButtonClicked = false;
                this.middleButtonClicked = false;
                break;
            case 2:
                this.leftButtonClicked = false;
                this.rightButtonClicked = false;
                this.middleButtonClicked = true;
                break;
            case 3:
                this.leftButtonClicked = false;
                this.rightButtonClicked = true;
                this.middleButtonClicked = false;
                break;
            default:
                this.leftButtonClicked = true;
                this.rightButtonClicked = false;
                this.middleButtonClicked = false;
                break;
        }
    };
    Billy.prototype.handleMouseUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.behaviorClicking(e);
        this.isDragging = false;
        this.isClicking = false;
    };
    Billy.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.leftButtonClicked) {
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this.mouseX = x;
            this.mouseY = y;
            this.behaviorClicking(e);
        }
        else if (this.rightButtonClicked) {
            this.behaviorDragging(e);
        }
        else {
        }
    };
    Billy.prototype.handleMouseOut = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.isClicking = false;
        this.isDragging = false;
    };
    return Billy;
}());
var Block = (function () {
    function Block(_x, _y, _width, _height) {
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.selected = false;
    }
    return Block;
}());
var Configuration = (function () {
    function Configuration(_frequencies, _margin, _width, _heigth, _border, _separation, _selectedColor, _backgroundColor, _sensibility, _shortcuts) {
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
        if (_selectedColor == undefined) {
            this.selectedColor = '#ff0000';
        }
        else {
            this.selectedColor = _selectedColor;
        }
        if (_backgroundColor == undefined) {
            this.backgroundColor = '#EEEEEE';
        }
        else {
            this.backgroundColor = _backgroundColor;
        }
        if (_sensibility == undefined) {
            this.sensibility = 0.4;
        }
        else {
            this.sensibility = _sensibility;
        }
        if (_shortcuts == undefined) {
            this.shortcuts = new Shortcuts(null, null, null, null, null, null, null);
        }
        else {
            this.shortcuts = new Shortcuts(_shortcuts.moveSelectionUp, _shortcuts.moveSelectionLeft, _shortcuts.moveSelectionRight, _shortcuts.moveSelectionDown, _shortcuts.copySelection, _shortcuts.pasteSelection, _shortcuts.deleteSelection);
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
    function Shortcuts(_moveSelectionUp, _moveSelectionLeft, _moveSelectionRight, _moveSelectionDown, _copySelection, _pasteSelection, _deleteSelection) {
        if (_moveSelectionUp == undefined) {
            this.moveSelectionUp = [23, 54, 33];
        }
        else {
            this.moveSelectionUp = _moveSelectionUp;
        }
        if (_moveSelectionLeft == undefined) {
            this.moveSelectionLeft = [23, 54, 33];
        }
        else {
            this.moveSelectionLeft = _moveSelectionLeft;
        }
        if (_moveSelectionRight == undefined) {
            this.moveSelectionRight = [23, 54, 33];
        }
        else {
            this.moveSelectionRight = _moveSelectionRight;
        }
        if (_moveSelectionDown == undefined) {
            this.moveSelectionDown = [23, 54, 33];
        }
        else {
            this.moveSelectionDown = _moveSelectionDown;
        }
        if (_copySelection == undefined) {
            this.copySelection = [23, 54, 33];
        }
        else {
            this.copySelection = _copySelection;
        }
        if (_pasteSelection == undefined) {
            this.pasteSelection = [23, 54, 33];
        }
        else {
            this.pasteSelection = _pasteSelection;
        }
        if (_deleteSelection == undefined) {
            this.deleteSelection = [23, 54, 33];
        }
        else {
            this.deleteSelection = _deleteSelection;
        }
    }
    return Shortcuts;
}());
