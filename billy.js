//DESLOCAMENTO / WIDTH DO QUADRADO
var billy = (function () {
    function billy(selector, config, measures) {
        this._isDragging = false;
        this._isCtrlPressed = false;
        this._isShiftPressed = false;
        this._isUpArrowPressed = false;
        this._isDownArrowPressed = false;
        this._isLeftArrowPressed = false;
        this._isRigthArrowPressed = false;
        this._offsetX = 0;
        this._offsetY = 0;
        this._measuresWidth = 0;
        this._measuresHeight = 0;
        this._measures = measures;
        this._configuration = new configuration(config._frequencies, config._margin, config._width, config._heigth, config._border, config._separation, config._backgroundColor, config._borderColor, config._shortcuts);
        if (this._configuration._shortcuts == null) {
            this._configuration._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        }
        var that = this;
        this._canvas = document.getElementById(selector);
        this._canvas.addEventListener('click', function (e) { that.handleClick(e); });
        this._canvas.addEventListener('keydown', function (e) { that.handleKeyDown(e); });
        this._canvas.addEventListener('keyup', function (e) { that.handleKeyUp(e); });
        this._canvas.addEventListener('mousedown', function (e) { that.handleMouseDown(e); });
        this._canvas.addEventListener('mouseup', function (e) { that.handleMouseUp(e); });
        this._canvas.addEventListener('mousemove', function (e) { that.handleMouseMove(e); });
        this._canvas.addEventListener('mouseout', function (e) { that.handleMouseOut(e); });
        this._canvas.addEventListener('contextmenu', function (e) { that.handleContextMenu(e); }, false);
        this._canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        var factor = 0.05;
        var maxWidth = this._canvas.parentElement.offsetWidth - this._canvas.parentElement.offsetWidth * factor;
        var maxHeigth = (this._configuration._heigth * this._configuration._frequencies) + (this._configuration._border * (this._configuration._frequencies + 1)) + this._configuration._margin * 2;
        window.addEventListener('resize', function () {
            that._canvas.width = that._canvas.parentElement.offsetWidth - that._canvas.parentElement.offsetWidth * factor;
            that._canvas.height = maxHeigth;
            that._offsetX = 0;
            that._offsetY = 0;
            that.draw();
        });
        this._canvas.width = maxWidth;
        this._canvas.height = maxHeigth;
    }
    billy.prototype.draw = function () {
        var width = 0;
        for (var i = 0; i <= this._measures.length - 1; i++) {
            var pulses = this._measures[i]._pulses * this._measures[i]._rhythm;
            width += (pulses * this._configuration._width) + (pulses * this._configuration._border) + this._configuration._margin + this._configuration._separation;
        }
        var context = this._canvas.getContext("2d");
        var x = this._configuration._margin;
        var y = this._configuration._margin;
        context.beginPath();
        for (var i = 0; i <= this._measures.length - 1; i++) {
            context.moveTo(x, y);
            // x
            for (var w = 0; w <= this._configuration._frequencies; w++) {
                var line = w == 0 ? 0 : this._configuration._border;
                for (var z = 0; z <= this._configuration._border; z++) {
                    context.moveTo(x - this._offsetX, y + (this._configuration._heigth + line) * w + z);
                    context.lineTo(x + (this._configuration._width * this._measures[i]._pulses * this._measures[i]._rhythm) + (this._configuration._border * this._measures[i]._pulses * this._measures[i]._rhythm) + this._configuration._border - this._offsetX, y + (this._configuration._heigth + line) * w + z);
                }
            }
            // y
            for (var w = 0; w <= this._measures[i]._pulses * this._measures[i]._rhythm; w++) {
                var line = w == 0 ? 0 : this._configuration._border;
                for (var z = 0; z <= this._configuration._border; z++) {
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
    };
    billy.prototype.handleClick = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
    };
    billy.prototype.handleKeyDown = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
    };
    billy.prototype.handleKeyUp = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        this._isDragging = false;
    };
    billy.prototype.handleMouseDown = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        document.body.style.cursor = 'pointer';
        var rect = this._canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this._mouseX = x;
        this._mouseY = y;
        this._isDragging = true;
    };
    billy.prototype.handleMouseUp = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        document.body.style.cursor = 'default';
        this._isDragging = false;
    };
    billy.prototype.handleMouseOut = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        document.body.style.cursor = 'default';
    };
    billy.prototype.handleMouseMove = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        if (this._isDragging) {
            document.body.style.cursor = 'move';
            var rect = this._canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this._offsetX += (x - this._mouseX) * -1;
            this._offsetY += (y - this._mouseY) * -1;
            // as medidas, quando maiores que o tamanho do canvas, não devem ultrapassar os limites do canvas
            if (this._offsetX > this._measuresWidth - this._canvas.width - this._configuration._separation) {
                this._offsetX = this._measuresWidth - this._canvas.width - this._configuration._separation + this._configuration._border;
            }
            else if (this._offsetX < 1) {
                this._offsetX = 0;
            }
            // caso as medidas somadas sejam menores que o tamanho do canvas, as medidas devem sempre encostar na esquerda
            if (this._measuresWidth < this._canvas.width) {
                this._offsetX = 0;
            }
            this._mouseX = x;
            this._mouseY = y;
            var context = this._canvas.getContext("2d");
            context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this.draw();
        }
        else {
            document.body.style.cursor = 'pointer';
        }
    };
    billy.prototype.handleContextMenu = function (e) {
    };
    billy.prototype.getBlocks = function () {
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
    };
    billy.prototype.getMeasures = function () {
    };
    return billy;
}());
var block = (function () {
    function block(_x, _y, _width, _height) {
        this._x = _x;
        this._y = _y;
        this._width = _width;
        this._height = _height;
    }
    return block;
}());
var configuration = (function () {
    function configuration(_frequencies, _margin, _width, _heigth, _border, _separation, _backgroundColor, _borderColor, _shortcuts) {
        if (_frequencies == null) {
            this._frequencies = 7;
        }
        else {
            this._frequencies = _frequencies;
        }
        if (_margin == null) {
            this._margin = 5;
        }
        else {
            this._margin = _margin;
        }
        if (_width == null) {
            this._width = 40;
        }
        else {
            this._width = _width;
        }
        if (_heigth == null) {
            this._heigth = 25;
        }
        else {
            this._heigth = _heigth;
        }
        if (_border == null) {
            this._border = 5;
        }
        else {
            this._border = _border;
        }
        if (_separation == null) {
            this._separation = 10;
        }
        else {
            this._separation = _separation;
        }
        if (_backgroundColor == null) {
            this._backgroundColor = '#EEEEEE';
        }
        else {
            this._backgroundColor = _backgroundColor;
        }
        if (_borderColor == null) {
            this._borderColor = '#000000';
        }
        else {
            this._borderColor = _borderColor;
        }
        if (_shortcuts == null) {
            this._shortcuts = new shortcuts(null, null, null, null, null, null, null);
        }
        else {
            this._shortcuts = _shortcuts;
        }
    }
    return configuration;
}());
var measure = (function () {
    function measure(_pulses, _rhythm) {
        if (_pulses == null) {
            this._pulses = 4;
        }
        else {
            this._pulses = _pulses;
        }
        if (_rhythm == null) {
            this._rhythm = 1;
        }
        else {
            this._rhythm = _rhythm;
        }
    }
    return measure;
}());
var shortcuts = (function () {
    function shortcuts(_moveSelectionUp, _moveSelectionLeft, _moveSelectionRight, _moveSelectionDown, _copySelection, _pasteSelection, _deleteSelection) {
        if (_moveSelectionUp == null) {
            this._moveSelectionUp = [23, 54, 33];
        }
        else {
            this._moveSelectionUp = _moveSelectionUp;
        }
        if (_moveSelectionLeft == null) {
            this._moveSelectionLeft = [23, 54, 33];
        }
        else {
            this._moveSelectionLeft = _moveSelectionLeft;
        }
        if (_moveSelectionRight == null) {
            this._moveSelectionRight = [23, 54, 33];
        }
        else {
            this._moveSelectionRight = _moveSelectionRight;
        }
        if (_moveSelectionDown == null) {
            this._moveSelectionDown = [23, 54, 33];
        }
        else {
            this._moveSelectionDown = _moveSelectionDown;
        }
        if (_copySelection == null) {
            this._copySelection = [23, 54, 33];
        }
        else {
            this._copySelection = _copySelection;
        }
        if (_pasteSelection == null) {
            this._pasteSelection = [23, 54, 33];
        }
        else {
            this._pasteSelection = _pasteSelection;
        }
        if (_deleteSelection == null) {
            this._deleteSelection = [23, 54, 33];
        }
        else {
            this._deleteSelection = _deleteSelection;
        }
    }
    return shortcuts;
}());
