package com.ftn.sbnz.model.events;

public class PassiveBingeEvent {
    public Long sessionId;
    public Long ts;

    public PassiveBingeEvent() {}
    public PassiveBingeEvent(Long sessionId, Long ts) {
        this.sessionId = sessionId;
        this.ts = ts;
    }

    public Long getSessionId() { return ts; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }
}
