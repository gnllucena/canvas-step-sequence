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
var billy = (function () {
    function billy(selector, config, measures) {
        this._blocks = new Array();
        this._pressed = new Array();
        this._isDragging = false;
        this._isClicking = false;
        this._leftButtonClicked = false;
        this._rightButtonClicked = false;
        this._middleButtonClicked = false;
        this._offsetX = 0;
        this._offsetY = 0;
        this._widthMeasures = 0;
        this._heigthMeasures = 0;
        this._measures = measures;
        this._configuration = new configuration(config._frequencies, config._margin, config._width, config._heigth, config._border, config._separation, config._selectedColor, config._backgroundColor, config._sensibility);
        if (this._configuration._shortcuts == null) {
            this._configuration._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        }
        var that = this;
        this._canvas = document.getElementById(selector);
        this._canvas.addEventListener('keydown', function (e) {
            that.handleKeyDown(e);
            console.log('keydown handle called.');
        });
        this._canvas.addEventListener('keyup', function (e) {
            that.handleKeyUp(e);
            console.log('keyup handle called.');
        });
        this._canvas.addEventListener('mousedown', function (e) {
            that.handleMouseDown(e);
            console.log('mousedown handle called.');
        });
        this._canvas.addEventListener('mouseup', function (e) {
            that.handleMouseUp(e);
            console.log('mouseup handle called.');
        });
        this._canvas.addEventListener('mousemove', function (e) {
            that.handleMouseMove(e);
            console.log('mousemove handle called.');
        });
        this._canvas.addEventListener('mouseout', function (e) {
            that.handleMouseOut(e);
            console.log('mouseout handle called.');
        });
        this._canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        var factor = 0.05;
        var maxWidth = this._canvas.parentElement.offsetWidth - this._canvas.parentElement.offsetWidth * factor;
        var maxHeigth = (this._configuration._heigth * this._configuration._frequencies) + (this._configuration._border * (this._configuration._frequencies + 1)) + this._configuration._margin * 2;
        window.addEventListener('resize', function () {
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
    billy.prototype.draw = function () {
        var context = this._canvas.getContext("2d");
        var canvasWidthAndWidth = this._canvas.width + this._configuration._width;
        var canvasHeigthAndHeigth = this._canvas.height + this._configuration._heigth;
        var inversedWidth = this._configuration._width * -1;
        var inversedHeigth = this._configuration._heigth * -1;
        this._blocks = this.blocks();
        for (var _i = 0, _a = this._blocks; _i < _a.length; _i++) {
            var block_1 = _a[_i];
            var outX = block_1._x < inversedWidth || block_1._x > canvasWidthAndWidth;
            var outY = block_1._y < inversedHeigth || block_1._y > canvasHeigthAndHeigth;
            if (outX || outY) {
                continue;
            }
            if (block_1._selected) {
                context.fillStyle = this._configuration._selectedColor;
            }
            else {
                context.fillStyle = this._configuration._backgroundColor;
            }
            context.fillRect(block_1._x, block_1._y, block_1._width, block_1._height);
        }
    };
    billy.prototype.blocks = function () {
        // ------------------------------ ---------------- --------
        // --  1  --  4  --  7  --  10 -- --  13 --  16 -- -- 19 --
        // ------------------------------ ---------------- --------
        // --  2  --  5  --  8  --  11 -- --  14 --  17 -- -- 20 --
        // ------------------------------ ---------------- --------
        // --  3  --  6  --  9  --  12 -- --  15 --  18 -- -- 21 --
        // ------------------------------ ---------------- --------
        this._widthMeasures = 0;
        var newBlocks = new Array();
        var marginAndBorder = this._configuration._margin + this._configuration._border;
        var widthAndBorder = this._configuration._width + this._configuration._border;
        var heigthAndBorder = this._configuration._heigth + this._configuration._border;
        var marginAndSeparation = this._configuration._margin + this._configuration._separation;
        var heigthFrequencies = marginAndBorder;
        for (var i = 0; i <= this._measures.length - 1; i++) {
            var measure_1 = this._measures[i];
            var pulsesTimesRhythm = measure_1._pulses * measure_1._rhythm;
            var widthPulses = this._widthMeasures + marginAndBorder;
            for (var w = 0; w <= pulsesTimesRhythm - 1; w++) {
                newBlocks.push(new block(widthPulses - this._offsetX, heigthFrequencies - this._offsetY, this._configuration._width, this._configuration._heigth));
                for (var z = 1; z <= this._configuration._frequencies - 1; z++) {
                    heigthFrequencies += heigthAndBorder;
                    newBlocks.push(new block(widthPulses - this._offsetX, heigthFrequencies - this._offsetY, this._configuration._width, this._configuration._heigth));
                }
                widthPulses += widthAndBorder;
                heigthFrequencies = marginAndBorder;
            }
            heigthFrequencies = marginAndBorder;
            this._widthMeasures += (pulsesTimesRhythm * this._configuration._width) + ((pulsesTimesRhythm * this._configuration._border)) + marginAndSeparation;
        }
        for (var i = 0; i <= this._blocks.length - 1; i++) {
            newBlocks[i]._selected = this._blocks[i]._selected;
        }
        this._blocks = newBlocks;
        // Because we don't have a separation in the end
        this._widthMeasures = this._widthMeasures - this._configuration._separation;
        return this._blocks;
    };
    billy.prototype.behaviorDragging = function (e) {
        if (!this._isDragging) {
            return;
        }
        var rect = this._canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var newX = x - this._mouseX;
        var newY = x - this._mouseY;
        this._offsetX += (newX - newX * this._configuration._sensibility) * -1;
        this._offsetY = 0;
        // this._offsetY += (newY - newY * this._configuration._sensibility) * -1;
        this._mouseX = x;
        this._mouseY = y;
        if (this._widthMeasures < this._canvas.width) {
            // if sum of measures width is lesser than canvas width, we don't have to worry about offsets
            this._offsetX = 0;
        }
        else {
            // if it's not, we can't let the draw in canvas offset forever
            if (this._offsetX > this._widthMeasures - this._canvas.width + this._configuration._margin + this._configuration._border) {
                this._offsetX = this._widthMeasures - this._canvas.width + this._configuration._margin + this._configuration._border;
            }
            else if (this._offsetX < 1) {
                this._offsetX = 0;
            }
        }
        var context = this._canvas.getContext("2d");
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.draw();
    };
    billy.prototype.behaviorClicking = function (e) {
        if (!this._isClicking || !this._leftButtonClicked) {
            return;
        }
        var sorted = this.blocks().slice(0).sort(function (a, b) {
            if (a._x > b._x) {
                return 1;
            }
            else if (a._x < b._x) {
                return -1;
            }
            if (a._y < b._y) {
                return -1;
            }
            else if (a._y > b._y) {
                return 1;
            }
            return 0;
        });
        var length = Object.keys(sorted).length;
        // group object by x axis, if click was before this axis
        // we don't need to check other blocks with the same x axis.
        var grouping = {};
        for (var i = 0; i <= length - 1; i++) {
            var block_2 = sorted[i];
            if (grouping[block_2._y] === undefined) {
                grouping[block_2._y] = [block_2._y];
                grouping[block_2._y].pop();
                grouping[block_2._y].push(block_2._x);
            }
            else {
                grouping[block_2._y].push(block_2._x);
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
            if (yofBlock < this._offsetY * -1) {
                continue;
            }
            // click was in border or in margin
            if (this._mouseY < yofBlock) {
                continue;
            }
            // must check if click was in range of a block
            if (yofBlock - this._offsetY <= this._mouseY && this._mouseY < yofBlock + this._configuration._heigth) {
                var xs = grouping[key];
                for (var w = 0; w <= xs.length; w++) {
                    var xofBlock = xs[w];
                    // we don't have to handle blocks not written in the canvas
                    if (xofBlock < this._offsetX * -1) {
                        continue;
                    }
                    // click was in border or in margin
                    if (this._mouseX < xofBlock) {
                        continue;
                    }
                    // found
                    if (xofBlock - this._offsetX <= this._mouseX && this._mouseX < xofBlock + this._configuration._width) {
                        exit = true;
                        var context = this._canvas.getContext("2d");
                        context.fillStyle = this._configuration._selectedColor;
                        context.fillRect(xofBlock, yofBlock, this._configuration._width, this._configuration._heigth);
                        var index = this._blocks.map(function (x) {
                            return x._x.toString() + '-' + x._y;
                        }).indexOf(xofBlock.toString() + '-' + yofBlock.toString());
                        var block_3 = this._blocks[index];
                        block_3._selected = true;
                        break;
                    }
                }
            }
        }
    };
    billy.prototype.handleKeyDown = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    billy.prototype.handleKeyUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    billy.prototype.handleMouseDown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var rect = this._canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this._mouseX = x;
        this._mouseY = y;
        this._isDragging = true;
        this._isClicking = true;
        switch (e.which) {
            case 1:
                this._leftButtonClicked = true;
                this._rightButtonClicked = false;
                this._middleButtonClicked = false;
                break;
            case 2:
                this._leftButtonClicked = false;
                this._rightButtonClicked = false;
                this._middleButtonClicked = true;
                break;
            case 3:
                this._leftButtonClicked = false;
                this._rightButtonClicked = true;
                this._middleButtonClicked = false;
                break;
            default:
                this._leftButtonClicked = true;
                this._rightButtonClicked = false;
                this._middleButtonClicked = false;
                break;
        }
    };
    billy.prototype.handleMouseUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.behaviorClicking(e);
        this._isDragging = false;
        this._isClicking = false;
    };
    billy.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this._rightButtonClicked) {
            this.behaviorDragging(e);
        }
        else {
            var rect = this._canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this._mouseX = x;
            this._mouseY = y;
            this.behaviorClicking(e);
        }
    };
    billy.prototype.handleMouseOut = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this._isClicking = false;
        this._isDragging = false;
    };
    return billy;
}());
var block = (function () {
    function block(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._selected = false;
    }
    return block;
}());
var configuration = (function () {
    function configuration(frequencies, margin, width, heigth, border, separation, selectedColor, backgroundColor, sensibility) {
        if (frequencies == null) {
            this._frequencies = 7;
        }
        else {
            this._frequencies = frequencies;
        }
        if (margin == null) {
            this._margin = 5;
        }
        else {
            this._margin = margin;
        }
        if (width == null) {
            this._width = 40;
        }
        else {
            this._width = width;
        }
        if (heigth == null) {
            this._heigth = 25;
        }
        else {
            this._heigth = heigth;
        }
        if (border == null) {
            this._border = 5;
        }
        else {
            this._border = border;
        }
        if (separation == null) {
            this._separation = 10;
        }
        else {
            this._separation = separation;
        }
        if (selectedColor == null) {
            this._selectedColor = '#ff0000';
        }
        else {
            this._selectedColor = selectedColor;
        }
        if (backgroundColor == null) {
            this._backgroundColor = '#EEEEEE';
        }
        else {
            this._backgroundColor = backgroundColor;
        }
        if (sensibility == null) {
            this._sensibility = 0.4;
        }
        else {
            this._sensibility = sensibility;
        }
        this._shortcuts = new shortcuts(null, null, null, null, null, null, null);
    }
    return configuration;
}());
var measure = (function () {
    function measure(pulses, rhythm) {
        if (pulses == null) {
            this._pulses = 4;
        }
        else {
            this._pulses = pulses;
        }
        if (rhythm == null) {
            this._rhythm = 1;
        }
        else {
            this._rhythm = rhythm;
        }
    }
    return measure;
}());
var shortcuts = (function () {
    function shortcuts(moveSelectionUp, moveSelectionLeft, moveSelectionRight, moveSelectionDown, copySelection, pasteSelection, deleteSelection) {
        if (moveSelectionUp == null) {
            this._moveSelectionUp = [23, 54, 33];
        }
        else {
            this._moveSelectionUp = moveSelectionUp;
        }
        if (moveSelectionLeft == null) {
            this._moveSelectionLeft = [23, 54, 33];
        }
        else {
            this._moveSelectionLeft = moveSelectionLeft;
        }
        if (moveSelectionRight == null) {
            this._moveSelectionRight = [23, 54, 33];
        }
        else {
            this._moveSelectionRight = moveSelectionRight;
        }
        if (moveSelectionDown == null) {
            this._moveSelectionDown = [23, 54, 33];
        }
        else {
            this._moveSelectionDown = moveSelectionDown;
        }
        if (copySelection == null) {
            this._copySelection = [23, 54, 33];
        }
        else {
            this._copySelection = copySelection;
        }
        if (pasteSelection == null) {
            this._pasteSelection = [23, 54, 33];
        }
        else {
            this._pasteSelection = pasteSelection;
        }
        if (deleteSelection == null) {
            this._deleteSelection = [23, 54, 33];
        }
        else {
            this._deleteSelection = deleteSelection;
        }
    }
    return shortcuts;
}());
