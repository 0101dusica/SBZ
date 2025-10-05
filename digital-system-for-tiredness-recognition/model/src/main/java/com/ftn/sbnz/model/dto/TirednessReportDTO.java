package com.ftn.sbnz.model.dto;

public class TirednessReportDTO {
    public Long sessionId;
    public int subjectiveTirednessLevel;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public int getSubjectiveTirednessLevel() { return subjectiveTirednessLevel; }
    public void setSubjectiveTirednessLevel(int subjectiveTirednessLevel) { this.subjectiveTirednessLevel = subjectiveTirednessLevel; }
}
