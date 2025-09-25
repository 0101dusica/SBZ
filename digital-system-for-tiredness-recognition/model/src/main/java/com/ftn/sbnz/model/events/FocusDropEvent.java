package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class FocusDropEvent implements Serializable {
    private LocalDateTime ts;
    private double charsPerMinDrop;
    private double errorRateIncrease;

    public FocusDropEvent() {}
    public FocusDropEvent(LocalDateTime ts, double charsPerMinDrop, double errorRateIncrease) {
        this.ts = ts;
        this.charsPerMinDrop = charsPerMinDrop;
        this.errorRateIncrease = errorRateIncrease;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public double getCharsPerMinDrop() { return charsPerMinDrop; }
    public void setCharsPerMinDrop(double charsPerMinDrop) { this.charsPerMinDrop = charsPerMinDrop; }
    public double getErrorRateIncrease() { return errorRateIncrease; }
    public void setErrorRateIncrease(double errorRateIncrease) { this.errorRateIncrease = errorRateIncrease; }
}
