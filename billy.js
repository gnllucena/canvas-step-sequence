var billy = (function () {
    function billy(parameters, measures) {
        this.parameters = parameters;
        this.measures = measures;
        if (this.parameters.functions == null) {
            this.parameters.functions = new functions();
        }
        if (this.parameters.shortcuts == null) {
            this.parameters.shortcuts = new shortcuts();
        }
        var handleClick = this.parameters.functions.handleClick;
        var handleKeyDown = this.parameters.functions.handleKeyDown;
        var handleKeyUp = this.parameters.functions.handleKeyUp;
        var handleMouseDown = this.parameters.functions.handleMouseDown;
        var handleMouseUp = this.parameters.functions.handleMouseUp;
        var handleMouseMove = this.parameters.functions.handleMouseMove;
        var handleContextMenu = this.parameters.functions.handleContextMenu;
        var canvas = document.getElementById(this.parameters.canvas);
        canvas.addEventListener('click', function (e) { handleClick(e); });
        canvas.addEventListener('keydown', function (e) { handleKeyDown(e); });
        canvas.addEventListener('keyup', function (e) { handleKeyUp(e); });
        canvas.addEventListener('mousedown', function (e) { handleMouseDown(e); });
        canvas.addEventListener('mouseup', function (e) { handleMouseUp(e); });
        canvas.addEventListener('mousemove', function (e) { handleMouseMove(e); });
        canvas.addEventListener('contextmenu', function (e) { handleContextMenu(e); }, false);
        canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        var factor = 0.05;
        var maxWidth = canvas.parentElement.offsetWidth - canvas.parentElement.offsetWidth * factor;
        var maxHeigth = (this.parameters.heigth * this.parameters.frequencies) + (this.parameters.border * (this.parameters.frequencies + 1)) + this.parameters.margin * 2;
        var that = this;
        window.addEventListener('resize', function () {
            that.canvas.width = that.canvas.parentElement.offsetWidth - that.canvas.parentElement.offsetWidth * factor;
            that.canvas.height = maxHeigth;
            that.draw();
        });
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeigth;
    }
    billy.prototype.draw = function () {
        var width = 0;
        for (var i = 0; i <= this.measures.length - 1; i++) {
            var pulses = this.measures[i].pulses * this.measures[i].rhythm;
            width += (pulses * this.parameters.width) + (pulses * this.parameters.border) + this.parameters.margin + this.parameters.separation;
        }
        this.context = this.canvas.getContext("2d");
        this.context.beginPath();
        var x = this.parameters.margin;
        var y = this.parameters.margin;
        for (var i = 0; i <= this.measures.length - 1; i++) {
            this.context.moveTo(x, y);
            // x
            for (var w = 0; w <= this.parameters.frequencies; w++) {
                var line = w == 0 ? 0 : this.parameters.border;
                for (var z = 0; z <= this.parameters.border; z++) {
                    this.context.moveTo(x, y + (this.parameters.heigth + line) * w + z);
                    this.context.lineTo(x + (this.parameters.width * this.measures[i].pulses * this.measures[i].rhythm) + (this.parameters.border * this.measures[i].pulses * this.measures[i].rhythm) + this.parameters.border, y + (this.parameters.heigth + line) * w + z);
                }
            }
            // y
            for (var w = 0; w <= this.measures[i].pulses * this.measures[i].rhythm; w++) {
                var line = w == 0 ? 0 : this.parameters.border;
                for (var z = 0; z <= this.parameters.border; z++) {
                    this.context.moveTo(x + (this.parameters.width + line) * w + z, y);
                    this.context.lineTo(x + (this.parameters.width + line) * w + z, y + (this.parameters.heigth * this.parameters.frequencies) + (this.parameters.border * (this.parameters.frequencies + 1)));
                }
            }
            x += this.parameters.margin + (this.parameters.width * this.measures[i].pulses * this.measures[i].rhythm) + (this.parameters.border * this.measures[i].pulses * this.measures[i].rhythm) + this.parameters.separation;
        }
        this.context.strokeStyle = this.parameters.borderColor;
        this.context.stroke();
        this.context.closePath();
    };
    billy.prototype.getBlocksMap = function () {
        var widthSeparation = 0;
        var widthPulse = 0;
        var heightPulse = 0;
        if (map.length == 0) {
            for (var i = 0; i <= measures - 1; i++) {
                heightPulse = 0;
                var aux = 0;
                for (var x = 0; x <= frequencies - 1; x++) {
                    var yOfPulsesPixel = margin + border + heightPulse;
                    for (var y = 0; y <= pulses - 1; y++) {
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
    };
    billy.prototype.getMeasuresMap = function () {
    };
    return billy;
}());
var block = (function () {
    function block(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return block;
}());
var functions = (function () {
    function functions(param) {
        if (param === void 0) { param = {
            handleClick: function (e) {
                var i = 0;
            },
            handleKeyDown: function (e) {
                var i = 0;
            },
            handleKeyUp: function (e) {
                var i = 0;
            },
            handleMouseDown: function (e) {
                var i = 0;
            },
            handleMouseUp: function (e) {
                var i = 0;
            },
            handleMouseMove: function (e) {
                var i = 0;
            },
            handleContextMenu: function (e) {
                var i = 0;
            }
        }; }
        this.handleClick = param.handleClick;
        this.handleKeyDown = param.handleKeyDown;
        this.handleKeyUp = param.handleKeyUp;
        this.handleMouseDown = param.handleMouseDown;
        this.handleMouseUp = param.handleMouseUp;
        this.handleMouseMove = param.handleMouseMove;
        this.handleContextMenu = param.handleContextMenu;
    }
    return functions;
}());
var measure = (function () {
    function measure(pulses, rhythm) {
        this.pulses = pulses;
        this.rhythm = rhythm;
    }
    return measure;
}());
var parameters = (function () {
    function parameters(param) {
        if (param === void 0) { param = {
            canvas: "canvas",
            frequencies: 7,
            margin: 5,
            width: 80,
            heigth: 30,
            border: 5,
            separation: 10,
            backgroundColor: "#FFFFFF",
            borderColor: "#000000",
            functions: new functions(),
            shortcuts: new shortcuts(),
        }; }
        this.canvas = param.canvas;
        this.frequencies = param.frequencies;
        this.margin = param.margin;
        this.width = param.width;
        this.heigth = param.heigth;
        this.border = param.border;
        this.separation = param.separation;
        this.backgroundColor = param.backgroundColor;
        this.borderColor = param.borderColor;
        this.functions = param.functions;
        this.shortcuts = param.shortcuts;
    }
    return parameters;
}());
var shortcuts = (function () {
    function shortcuts(param) {
        if (param === void 0) { param = {
            moveSelectionUp: [43, 27, 98],
            moveSelectionLeft: [43, 27, 98],
            moveSelectionRight: [43, 27, 98],
            moveSelectionDown: [43, 27, 98],
            copySelection: [43, 27, 98],
            pasteSelection: [43, 27, 98],
            deleteSelection: [43, 27, 98],
        }; }
        this.moveSelectionUp = param.moveSelectionUp;
        this.moveSelectionLeft = param.moveSelectionLeft;
        this.moveSelectionRight = param.moveSelectionRight;
        this.moveSelectionDown = param.moveSelectionDown;
        this.copySelection = param.copySelection;
        this.pasteSelection = param.pasteSelection;
        this.deleteSelection = param.deleteSelection;
    }
    return shortcuts;
}());
