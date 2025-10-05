package com.ftn.sbnz.model.hypothesis;

public class MultitaskHypothesis {
    public Long sessionId;
    public Boolean confirmed;

    public MultitaskHypothesis(Long sessionId) {
        this.sessionId = sessionId;
    }

    public MultitaskHypothesis(Long sessionId, Boolean confirmed) {
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
