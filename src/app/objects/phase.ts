export class Phase<T>{
    step: T | number = 0;
    totalStep: number = 0;

    constructor(initialStep?, totalStep?) {
        this.step = initialStep;
        this.totalStep = totalStep;
    }
    setStep(step) {
        if (typeof this.step === "number" && this.totalStep - 1 >= step && step >= 0) {
            this.step = step;
        }
        else if (typeof this.step !== "number") {
            this.step = step;
        }
    }
    isStep(step) {
        return this.step === step;
    }
    hasNext(): boolean {
        return typeof this.step === "number" && this.totalStep - 1 > this.step;
    }
    hasPrevious(): boolean {
        return typeof this.step === "number" && this.step > 0;
    }
    next() {
        if (typeof this.step === "number" && this.hasNext()) {
            this.step++;
        }
    }
    previous() {
        if (typeof this.step === "number" && this.hasPrevious()) {
            this.step--;
        }
    }
}