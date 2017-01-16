interface IParameters {    
    canvas : string;
    frequencies : number,
    margin : number;
    width : number;
    heigth : number;
    border : number;
    separation : number;
    backgroundColor : string;
    borderColor : string;
    functions : functions;
    shortcuts : shortcuts;
}

class parameters {
    canvas : string;
    frequencies : number;
    margin : number;
    width : number;
    heigth : number;
    border : number;
    separation : number;
    backgroundColor : string;
    borderColor : string;
    functions : functions;
    shortcuts : shortcuts;

    constructor(param : IParameters = {
        canvas : "canvas",
        frequencies : 7,
        margin : 5,
        width : 80,
        heigth : 30,
        border : 5,
        separation : 10,
        backgroundColor : "#FFFFFF",
        borderColor : "#000000",
        functions : new functions(),
        shortcuts : new shortcuts(),
    }) {
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
}