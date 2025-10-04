package com.ftn.sbnz.model.events;

public class NoBreakStreakEvent {
    public Long ts;

    public NoBreakStreakEvent() {}
    public NoBreakStreakEvent(Long ts) { this.ts = ts; }

    public long getTs() { return ts; }
    public void setTs(Long ts) { this.ts = ts; }
}
