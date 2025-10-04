package com.ftn.sbnz.model.events;

public class ScreenTimeEvent {
    public long ts;
    public String device;
    public int active;

    public ScreenTimeEvent() {}
    public ScreenTimeEvent(long ts, String device, int active) {
        this.ts = ts;
        this.device = device;
        this.active = active;
    }

    public long getTs() { return ts; }
    public void setTs(long ts) { this.ts = ts; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public int getActive() { return active; }
    public void setActive(int active) { this.active = active; }
}
