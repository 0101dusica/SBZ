package com.ftn.sbnz.model.events;

public class KeyStrokeEvent {
    public long sessionId;
    public long ts;
    public double charsPerMin;
    public double errorRate;

    public KeyStrokeEvent() {}
    public KeyStrokeEvent(long sessionId, long ts, double charsPerMin, double errorRate) {
        this.sessionId = sessionId;
        this.ts = ts;
        this.charsPerMin = charsPerMin;
        this.errorRate = errorRate;
    }

    public long getSessionId() { return sessionId; }
    public void setSessionId(long sessionId) { this.sessionId = sessionId; }
    public long getTs() { return ts; }
    public void setTs(long ts) { this.ts = ts; }
    public double getCharsPerMin() { return charsPerMin; }
    public void setCharsPerMin(double charsPerMin) { this.charsPerMin = charsPerMin; }
    public double getErrorRate() { return errorRate; }
    public void setErrorRate(double errorRate) { this.errorRate = errorRate; }
}
