package com.ftn.sbnz.model.events;

public class AppFocusEvent {
    public long sessionId;
    public String category;
    public long ts;
    public long duration;

    public AppFocusEvent() {}

    public AppFocusEvent(long sessionId, String category, long ts, long duration) {
        this.sessionId = sessionId;
        this.category = category;
        this.ts = ts;
        this.duration = duration;
    }

    public long getSessionId() { return sessionId; }
    public void setSessionId(long sessionId) { this.sessionId = sessionId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public long getTs() { return ts; }
    public void setTs(long ts) { this.ts = ts; }
    public long getDuration() { return duration; }
    public void setDuration(long duration) { this.duration = duration; }
}
