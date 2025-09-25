package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.enums.RecommendationType;

import java.time.LocalDateTime;

public class Recommendation {

    private Long id;
    private Long sessionId;
    private RecommendationType type;
    private String message;
    private int priority; // 1 = highest, 5 = lowest
    private LocalDateTime createdAt;
    private boolean isRead;

    public Recommendation() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    public Recommendation(Long sessionId, RecommendationType type, String message, int priority) {
        this.sessionId = sessionId;
        this.type = type;
        this.message = message;
        this.priority = priority;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
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

    public RecommendationType getType() {
        return type;
    }

    public void setType(RecommendationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}
