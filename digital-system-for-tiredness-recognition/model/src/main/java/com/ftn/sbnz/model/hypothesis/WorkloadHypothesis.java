package com.ftn.sbnz.model.hypothesis;

public class WorkloadHypothesis {
    public Long sessionId;
    public Boolean confirmed;

    public WorkloadHypothesis(Long sessionId) {
        this.sessionId = sessionId;
    }

    public WorkloadHypothesis(Long sessionId, Boolean confirmed) {
        this.sessionId = sessionId;
        this.confirmed = confirmed;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public Boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(Boolean confirmed) {this.confirmed = confirmed;}
}