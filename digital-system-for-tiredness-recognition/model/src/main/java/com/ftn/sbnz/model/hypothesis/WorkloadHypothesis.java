package com.ftn.sbnz.model.hypothesis;

public class WorkloadHypothesis {
    public Long sessionId;

    public WorkloadHypothesis(Long sessionId) { this.sessionId = sessionId; }

    public Long getSessionId() {
        return sessionId;
    }
}