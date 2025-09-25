package com.ftn.sbnz.model.events;

import com.ftn.sbnz.model.enums.ActivityType;

import java.time.LocalDateTime;

public class ActivityEvent {

    private Long id;
    private Long sessionId;
    private ActivityType activityType;
    private LocalDateTime timestamp;
    private String details;
    private double intensity; // 0.0 - 1.0
    private int duration; // u sekundama

    public ActivityEvent() {
        this.timestamp = LocalDateTime.now();
    }

    public ActivityEvent(Long sessionId, ActivityType activityType) {
        this.sessionId = sessionId;
        this.activityType = activityType;
        this.timestamp = LocalDateTime.now();
    }

    public ActivityEvent(Long sessionId, ActivityType activityType, String details, double intensity) {
        this.sessionId = sessionId;
        this.activityType = activityType;
        this.details = details;
        this.intensity = intensity;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public double getIntensity() {
        return intensity;
    }

    public void setIntensity(double intensity) {
        this.intensity = intensity;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}

