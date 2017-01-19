class measure {
    public _pulses: number;
    public _rhythm: number;

    constructor(
        pulses: number, 
        rhythm: number) 
    { 
        if (pulses == null) {
            this._pulses = 4;
        } else {
            this._pulses = pulses;
        }

        if (rhythm == null) {
            this._rhythm = 1;
        } else {
            this._rhythm = rhythm;
        }
    }
}