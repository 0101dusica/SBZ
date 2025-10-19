package com.ftn.sbnz.model.events;

public class HighRiskTodaySignal {
    private Long sessionId;
    private Long ts;

    public HighRiskTodaySignal() {}

    public HighRiskTodaySignal(Long sessionId, Long ts) {
        this.sessionId = sessionId;
        this.ts = ts;
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
}
