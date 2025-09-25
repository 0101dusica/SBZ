package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class PhoneUsageEvent implements Serializable {
    private LocalDateTime ts;
    private String category;
    private int duration; // in minutes

    public PhoneUsageEvent() {}
    public PhoneUsageEvent(LocalDateTime ts, String category, int duration) {
        this.ts = ts;
        this.category = category;
        this.duration = duration;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
