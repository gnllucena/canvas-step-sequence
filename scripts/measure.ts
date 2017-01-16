class measure {
    public _pulses: number;
    public _rhythm: number;

    constructor(
        _pulses: number, 
        _rhythm: number) 
    { 
        if (_pulses == null) {
            this._pulses = 4;
        } else {
            this._pulses = _pulses;
        }

        if (_rhythm == null) {
            this._rhythm = 1;
        } else {
            this._rhythm = _rhythm;
        }
    }
}