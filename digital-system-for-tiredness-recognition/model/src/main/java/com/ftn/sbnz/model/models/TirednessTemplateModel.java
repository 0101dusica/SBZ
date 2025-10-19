package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.TirednessRisk;

public class TirednessTemplateModel {
    private ActivityType activityType;
    private int minDuration;
    private int maxDuration;
    private String riskLevel;
    private String recommendationMessage;
    private boolean enabled;

    public TirednessTemplateModel() {}

    public TirednessTemplateModel(ActivityType activityType, int minDuration, int maxDuration, 
                                String riskLevel, String recommendationMessage, boolean enabled) {
        this.activityType = activityType;
        this.minDuration = minDuration;
        this.maxDuration = maxDuration;
        this.riskLevel = riskLevel;
        this.recommendationMessage = recommendationMessage;
        this.enabled = enabled;
    }

    // Getteri i setteri
    public ActivityType getActivityType() { return activityType; }
    public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
    
    public int getMinDuration() { return minDuration; }
    public void setMinDuration(int minDuration) { this.minDuration = minDuration; }
    
    public int getMaxDuration() { return maxDuration; }
    public void setMaxDuration(int maxDuration) { this.maxDuration = maxDuration; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public String getRecommendationMessage() { return recommendationMessage; }
    public void setRecommendationMessage(String recommendationMessage) { this.recommendationMessage = recommendationMessage; }
    
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}