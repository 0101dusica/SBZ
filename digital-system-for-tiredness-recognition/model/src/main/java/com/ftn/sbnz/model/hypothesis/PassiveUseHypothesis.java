package com.ftn.sbnz.model.hypothesis;

public class PassiveUseHypothesis {
    public Long sessionId;

    public PassiveUseHypothesis(Long sessionId) { this.sessionId = sessionId; }

    public Long getSessionId() {
        return sessionId;
    }
}