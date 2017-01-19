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
        this._isDragging = false;
        this._isClicking = false;
        this._isCtrlPressed = false;
        this._isShiftPressed = false;
        this._isUpArrowPressed = false;
        this._isDownArrowPressed = false;
        this._isLeftArrowPressed = false;
        this._isRigthArrowPressed = false;
        this._offsetX = 0;
        this._offsetY = 0;
        this._widthMeasures = 0;
        this._heigthMeasures = 0;
        this._measures = measures;
        this._configuration = new configuration(config._frequencies, config._margin, config._width, config._heigth, config._border, config._separation, config._selectedColor, config._backgroundColor);
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
        this._canvas.addEventListener('contextmenu', function (e) {
            that.handleContextMenu(e);
            console.log('contextmenu handle called.');
        }, false);
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
        this._blocks = this.blocks();
        for (var _i = 0, _a = this._blocks; _i < _a.length; _i++) {
            var block_1 = _a[_i];
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
        // How canvas matrix is read
        // ------------------------------ ---------------- --------
        // --  1  --  2  --  3  --  4  -- --  13 --  14 -- -- 19 --
        // ------------------------------ ---------------- --------
        // --  5  --  6  --  7  --  8  -- --  15 --  16 -- -- 20 --
        // ------------------------------ ---------------- --------
        // --  9  --  10 --  11 --  12 -- --  17 --  18 -- -- 21 --
        // ------------------------------ ---------------- --------
        this._widthMeasures = 0;
        this._blocks = new Array();
        var marginAndBorder = this._configuration._margin + this._configuration._border;
        var widthAndBorder = this._configuration._width + this._configuration._border;
        var heigthAndBorder = this._configuration._heigth + this._configuration._border;
        var marginAndSeparation = this._configuration._margin + this._configuration._separation;
        var heigthFrequencies = marginAndBorder;
        for (var i = 0; i <= this._measures.length - 1; i++) {
            var measure_1 = this._measures[i];
            var pulsesTimesRhythm = measure_1._pulses * measure_1._rhythm;
            for (var w = 0; w <= this._configuration._frequencies - 1; w++) {
                var widthPulses = this._widthMeasures + marginAndBorder;
                this._blocks.push(new block(widthPulses - this._offsetX, heigthFrequencies, this._configuration._width, this._configuration._heigth, false));
                for (var z = 1; z <= pulsesTimesRhythm - 1; z++) {
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
    };
    billy.prototype.behaviorOffset = function (e) {
        if (!this._isDragging) {
            return;
        }
        var rect = this._canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var newX = x - this._mouseX;
        var newY = x - this._mouseY;
        this._offsetX += (newX - newX * 0.5) * -1;
        this._offsetY += (newY - newY * 0.5) * -1;
        this._mouseX = x;
        this._mouseY = y;
        var margin = 10;
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
    billy.prototype.behaviorClick = function (e) {
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
        // group object by x axis, if click was before this axis
        // we don't need to check other blocks with the same x axis.
        var grouping = {};
        for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
            var block_2 = sorted_1[_i];
            if (grouping[block_2._x] === undefined) {
                grouping[block_2._x] = [block_2._x];
            }
            grouping[block_2._x].push(block_2._y);
        }
        var length = Object.keys(grouping).length;
        var exit = false;
        // let's find out clicked block
        // todo: 
        // var filteredArray = array.filter(function (element) { 
        //     return element.id === 0;
        // });
        for (var i = 0; i <= length - 1; i++) {
            if (exit) {
                break;
            }
            var key = Object.keys(grouping)[i];
            var xofBlock = +key;
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
                var ys = grouping[key];
                for (var w = 0; w <= ys.length - 1; w++) {
                    if (exit) {
                        break;
                    }
                    var yofBlock = ys[w];
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
                        var index = this._blocks.map(function (x) {
                            return x._x.toString() + '-' + x._y;
                        }).indexOf(xofBlock.toString() + '-' + yofBlock.toString());
                        var block_3 = this._blocks[index];
                        block_3.select();
                        var context = this._canvas.getContext("2d");
                        context.fillStyle = this._configuration._selectedColor;
                        context.fillRect(xofBlock, yofBlock, this._configuration._width, this._configuration._heigth);
                        exit = true;
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
    };
    billy.prototype.handleMouseUp = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.behaviorClick(e);
        this._isDragging = false;
        this._isClicking = false;
    };
    billy.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.behaviorOffset(e);
    };
    billy.prototype.handleContextMenu = function (e) {
    };
    billy.prototype.getMeasures = function () {
    };
    return billy;
}());
var block = (function () {
    function block(x, y, width, height, selected) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._selected = selected;
    }
    block.prototype.select = function () {
        this._selected = true;
    };
    block.prototype.unselect = function () {
        this._selected = false;
    };
    return block;
}());
var configuration = (function () {
    function configuration(frequencies, margin, width, heigth, border, separation, selectedColor, backgroundColor) {
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
