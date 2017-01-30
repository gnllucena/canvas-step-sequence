class Measure {
    pulses: number;
    rhythm: number;

    constructor(
        _pulses: number, 
        _rhythm: number
    ) { 
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
}