package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.models.enums.TirednessRisk;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Recommendation {

    private Long sessionId;
    private String message;
    private TirednessRisk riskLevel;


    public Recommendation() {
    }

    public Recommendation(Long sessionId, String message) {
        this.sessionId = sessionId;
        this.message = message;
    }


    public Recommendation(Long sessionId, String message, TirednessRisk riskLevel) {
        this.sessionId = sessionId;
        this.message = message;
        this.riskLevel = riskLevel;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public TirednessRisk getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(TirednessRisk riskLevel) {
        this.riskLevel = riskLevel;
    }

    // Optional: toString method for easier debugging
    @Override
    public String toString() {
        return "Recommendation{" +
                "sessionId=" + sessionId +
                ", message='" + message + '\'' +
                ", riskLevel=" + riskLevel +
                '}';
    }
}
