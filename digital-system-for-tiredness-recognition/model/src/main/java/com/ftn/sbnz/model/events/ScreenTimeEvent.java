package com.ftn.sbnz.model.events;

import com.ftn.sbnz.model.models.enums.DeviceType;

public class ScreenTimeEvent {
    public long ts;
    public DeviceType device;
    public int active;

    public ScreenTimeEvent() {}
    public ScreenTimeEvent(long ts, DeviceType device, int active) {
        this.ts = ts;
        this.device = device;
        this.active = active;
    }

    public long getTs() { return ts; }
    public void setTs(long ts) { this.ts = ts; }
    public DeviceType getDevice() { return device; }
    public void setDevice(DeviceType device) { this.device = device; }
    public int getActive() { return active; }
    public void setActive(int active) { this.active = active; }
}
