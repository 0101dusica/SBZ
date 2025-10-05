package com.ftn.sbnz.model.events;

public class UserActiveEvent {
    public Long sessionId;
    public Long ts;
    public int activityDuration;
    public int breakDuration;

    public UserActiveEvent(Long sessionId, Long ts, int activityDuration, int breakDuration) {
        this.sessionId = sessionId;
        this.ts = ts;
        this.activityDuration = activityDuration;
        this.breakDuration = breakDuration;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getTs() {
        return ts;
    }

    public void setTs(Long ts) {
        this.ts = ts;
    }

    public int getActivityDuration() {
        return activityDuration;
    }

    public void setActivityDuration(int activityDuration) {
        this.activityDuration = activityDuration;
    }

    public int getBreakDuration() {
        return breakDuration;
    }

    public void setBreakDuration(int breakDuration) {
        this.breakDuration = breakDuration;
    }

}
