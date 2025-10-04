package com.ftn.sbnz.model.events;

public class EarlyFatigueSignal {
    public Long ts;

    public EarlyFatigueSignal() {}

    public EarlyFatigueSignal(Long ts) {
        this.ts = ts;
    }

    public long getTs() { return ts; }
    public void setTs(long ts) { this.ts = ts; }
}
