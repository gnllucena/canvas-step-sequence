interface IFunctions {
    handleClick : Function,
    handleKeyDown : Function,
    handleKeyUp : Function,
    handleMouseDown : Function,
    handleMouseUp : Function,
    handleMouseMove : Function,
    handleContextMenu : Function,
}

class functions {
    handleClick : Function;
    handleKeyDown : Function;
    handleKeyUp : Function;
    handleMouseDown : Function;
    handleMouseUp : Function;
    handleMouseMove : Function;
    handleContextMenu : Function;

    constructor(param : IFunctions = {
        handleClick : function(e) {
            let i = 0;
        },
        handleKeyDown : function(e) {
            let i = 0;
        },
        handleKeyUp : function(e) {
            let i = 0;
        },
        handleMouseDown : function(e) {
            let i = 0;
        },
        handleMouseUp : function(e) {
            let i = 0;
        },
        handleMouseMove : function(e) {
            let i = 0;
        },
        handleContextMenu : function(e) {
            let i = 0;
        }
    }) {
        this.handleClick = param.handleClick;
        this.handleKeyDown = param.handleKeyDown;
        this.handleKeyUp = param.handleKeyUp;
        this.handleMouseDown = param.handleMouseDown;
        this.handleMouseUp = param.handleMouseUp;
        this.handleMouseMove = param.handleMouseMove;
        this.handleContextMenu = param.handleContextMenu;
    }
}