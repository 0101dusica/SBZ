package com.ftn.sbnz.model.events;

public class PassiveBingeEvent {
    public Long ts;

    public PassiveBingeEvent() {}
    public PassiveBingeEvent(Long ts) { this.ts = ts; }

    public long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }
}
