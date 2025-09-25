package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class UserBreakEvent implements Serializable {
    private LocalDateTime ts;
    private int duration; // in minutes

    public UserBreakEvent() {}
    public UserBreakEvent(LocalDateTime ts, int duration) {
        this.ts = ts;
        this.duration = duration;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
