package com.ftn.sbnz.model.events;

public class MouseEvent {
    public long id;
    public long sessionId;
    public int movementCount;
    public int clickCount;
    public long startTimestamp;

    public MouseEvent() {}
    public MouseEvent(long id, long sessionId, int movementCount, int clickCount, long startTimestamp) {
        this.id = id;
        this.sessionId = sessionId;
        this.movementCount = movementCount;
        this.clickCount = clickCount;
        this.startTimestamp = startTimestamp;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public long getSessionId() { return sessionId; }
    public void setSessionId(long sessionId) { this.sessionId = sessionId; }
    public int getMovementCount() { return movementCount; }
    public void setMovementCount(int movementCount) { this.movementCount = movementCount; }
    public int getClickCount() { return clickCount; }
    public void setClickCount(int clickCount) { this.clickCount = clickCount; }
    public long getStartTimestamp() { return startTimestamp; }
    public void setStartTimestamp(long startTimestamp) { this.startTimestamp = startTimestamp; }
}
