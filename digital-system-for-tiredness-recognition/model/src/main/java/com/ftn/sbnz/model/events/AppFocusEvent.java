package com.ftn.sbnz.model.events;

public class AppFocusEvent {
    public Long sessionId;
    public String category;
    public Long ts;
    public int duration;

    public AppFocusEvent() {}

    public AppFocusEvent(Long sessionId, String category, Long ts, int duration) {
        this.sessionId = sessionId;
        this.category = category;
        this.ts = ts;
        this.duration = duration;
    }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
