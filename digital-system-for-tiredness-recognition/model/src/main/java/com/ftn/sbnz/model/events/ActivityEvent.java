package com.ftn.sbnz.model.events;

import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.DeviceType;

public class ActivityEvent {
    public long id;
    public Long sessionId;
    public ActivityType activityType;
    public DeviceType deviceType;
    public long startTimestamp;
    public long endTimestamp;
    public int activityDuration;
    public int breakDuration;
    public int typingSpeed;
    public int errors;
    public String category;

    public ActivityEvent() {}

    public ActivityEvent(long id, Long sessionId, ActivityType activityType, DeviceType deviceType,
                         long startTimestamp, long endTimestamp, int activityDuration, int breakDuration,
                         int typingSpeed, int errors, String category) {
        this.id = id;
        this.sessionId = sessionId;
        this.activityType = activityType;
        this.deviceType = deviceType;
        this.startTimestamp = startTimestamp;
        this.endTimestamp = endTimestamp;
        this.activityDuration = activityDuration;
        this.breakDuration = breakDuration;
        this.typingSpeed = typingSpeed;
        this.errors = errors;
        this.category = category;
    }

    // Getteri i setteri
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public ActivityType getActivityType() { return activityType; }
    public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }
    public long getStartTimestamp() { return startTimestamp; }
    public void setStartTimestamp(long startTimestamp) { this.startTimestamp = startTimestamp; }
    public long getEndTimestamp() { return endTimestamp; }
    public void setEndTimestamp(long endTimestamp) { this.endTimestamp = endTimestamp; }
    public int getActivityDuration() { return activityDuration; }
    public void setActivityDuration(int activityDuration) { this.activityDuration = activityDuration; }
    public int getBreakDuration() { return breakDuration; }
    public void setBreakDuration(int breakDuration) { this.breakDuration = breakDuration; }
    public int getTypingSpeed() { return typingSpeed; }
    public void setTypingSpeed(int typingSpeed) { this.typingSpeed = typingSpeed; }
    public int getErrors() { return errors; }
    public void setErrors(int errors) { this.errors = errors; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
