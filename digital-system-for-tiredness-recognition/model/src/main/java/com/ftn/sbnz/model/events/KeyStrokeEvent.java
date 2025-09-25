package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class KeyStrokeEvent implements Serializable {
    private LocalDateTime ts;
    private double charsPerMin;
    private double errorRate;

    public KeyStrokeEvent() {}
    public KeyStrokeEvent(LocalDateTime ts, double charsPerMin, double errorRate) {
        this.ts = ts;
        this.charsPerMin = charsPerMin;
        this.errorRate = errorRate;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public double getCharsPerMin() { return charsPerMin; }
    public void setCharsPerMin(double charsPerMin) { this.charsPerMin = charsPerMin; }
    public double getErrorRate() { return errorRate; }
    public void setErrorRate(double errorRate) { this.errorRate = errorRate; }
}
