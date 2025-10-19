package com.ftn.sbnz.model.events;

public class MultiTaskOverloadEvent {
    public Long ts;

    public MultiTaskOverloadEvent() {}
    public MultiTaskOverloadEvent(Long ts) { this.ts = ts; }

    public long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }
}
