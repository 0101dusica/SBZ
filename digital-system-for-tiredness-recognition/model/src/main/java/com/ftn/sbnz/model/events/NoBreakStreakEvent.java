package com.ftn.sbnz.model.events;

public class NoBreakStreakEvent {
    public Long sessionId;
    public Long ts;

    public NoBreakStreakEvent() {}
    public NoBreakStreakEvent(Long sessionId, Long ts) {
        this.sessionId = sessionId;
        this.ts = ts;
    }

    public Long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
}
