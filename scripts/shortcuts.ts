interface IShortcuts {    
    moveSelectionUp : number[];
    moveSelectionLeft : number[];
    moveSelectionRight : number[];
    moveSelectionDown : number[];
    copySelection : number[];
    pasteSelection : number[];
    deleteSelection : number[];
}

class shortcuts {
    moveSelectionUp : number[];
    moveSelectionLeft : number[];
    moveSelectionRight : number[];
    moveSelectionDown : number[];
    copySelection : number[];
    pasteSelection : number[];
    deleteSelection : number[];

    constructor(param : IShortcuts = {
        moveSelectionUp : [ 43, 27, 98 ],
        moveSelectionLeft : [ 43, 27, 98 ],
        moveSelectionRight : [ 43, 27, 98 ],
        moveSelectionDown : [ 43, 27, 98 ],
        copySelection : [ 43, 27, 98 ],
        pasteSelection : [ 43, 27, 98 ],
        deleteSelection : [ 43, 27, 98 ],
    }) {
        this.moveSelectionUp = param.moveSelectionUp;
        this.moveSelectionLeft = param.moveSelectionLeft;
        this.moveSelectionRight = param.moveSelectionRight;
        this.moveSelectionDown = param.moveSelectionDown;
        this.copySelection = param.copySelection;
        this.pasteSelection = param.pasteSelection;
        this.deleteSelection = param.deleteSelection;
    }
}