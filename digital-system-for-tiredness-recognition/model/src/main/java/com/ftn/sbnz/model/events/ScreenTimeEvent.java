package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ScreenTimeEvent implements Serializable {
    private LocalDateTime ts;
    private String device;
    private boolean active;

    public ScreenTimeEvent() {}
    public ScreenTimeEvent(LocalDateTime ts, String device, boolean active) {
        this.ts = ts;
        this.device = device;
        this.active = active;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
