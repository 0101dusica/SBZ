package com.ftn.sbnz.model.events;

public class MentalFatigueSignal {
    public Long ts;

    public MentalFatigueSignal() {}
    public MentalFatigueSignal(Long ts) { this.ts = ts; }

    public long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }
}
