package com.ftn.sbnz.model.events;

public class UserBreakEvent {
    public long sessionId;
    public long ts;
    public long breakDuration;

    public UserBreakEvent() {}
    public UserBreakEvent(long sessionId, long ts, long breakDuration) {
        this.sessionId = sessionId;
        this.ts = ts;
        this.breakDuration = breakDuration;
    }

    public long getSessionId() { return sessionId; }
    public void setSessionId(long sessionId) { this.sessionId = sessionId; }
    public long getTs() { return ts; }
    public void setTs(long ts) { this.ts = ts; }
    public long getBreakDuration() { return breakDuration; }
    public void setBreakDuration(long breakDuration) { this.breakDuration = breakDuration; }
}
