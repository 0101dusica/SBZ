package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.events.ActivityEvent;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Session {

    private Long id;
    private Long userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<ActivityEvent> activityEvents;
    private String sessionType;

    public Session() {
        this.activityEvents = new ArrayList<>();
    }

    public Session(Long id, Long userId, LocalDateTime startTime) {
        this.id = id;
        this.userId = userId;
        this.startTime = startTime;
        this.activityEvents = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public List<ActivityEvent> getActivityEvents() {
        return activityEvents;
    }

    public void setActivityEvents(List<ActivityEvent> activityEvents) {
        this.activityEvents = activityEvents;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public void addActivityEvent(ActivityEvent event) {
        this.activityEvents.add(event);
    }
}

