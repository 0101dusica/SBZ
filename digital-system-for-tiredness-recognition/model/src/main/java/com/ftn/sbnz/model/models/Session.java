package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.events.ActivityEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import java.util.ArrayList;
import java.util.List;

public class Session {
    private Long sessionId;
    private Long userId;
    private Long startTimestamp;
    private Long endTimestamp;
    private List<ActivityEvent> activityEvents;


    public Session(Long sessionId, Long userId, Long startTimestamp, Long endTimestamp,
                   int subjectiveTirednessLevel, List<String> risks, int riskLevel,
                   List<ActivityEvent> activityEvents) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.startTimestamp = startTimestamp;
        this.endTimestamp = endTimestamp;
        this.activityEvents = (activityEvents != null) ? activityEvents : new ArrayList<>();
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getStartTimestamp() {
        return startTimestamp;
    }

    public void setStartTimestamp(Long startTimestamp) {
        this.startTimestamp = startTimestamp;
    }

    public Long getEndTimestamp() {
        return endTimestamp;
    }

    public void setEndTimestamp(Long endTimestamp) {
        this.endTimestamp = endTimestamp;
    }


    public List<ActivityEvent> getActivityEvents() {
        return activityEvents;
    }

    public void setActivityEvents(List<ActivityEvent> activityEvents) {
        this.activityEvents = (activityEvents != null) ? activityEvents : new ArrayList<>();
    }
}

