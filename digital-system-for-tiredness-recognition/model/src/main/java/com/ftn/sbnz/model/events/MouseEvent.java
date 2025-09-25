package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class MouseEvent implements Serializable {
    private LocalDateTime ts;
    private double moveRate;
    private double clickRate;

    public MouseEvent() {}
    public MouseEvent(LocalDateTime ts, double moveRate, double clickRate) {
        this.ts = ts;
        this.moveRate = moveRate;
        this.clickRate = clickRate;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public double getMoveRate() { return moveRate; }
    public void setMoveRate(double moveRate) { this.moveRate = moveRate; }
    public double getClickRate() { return clickRate; }
    public void setClickRate(double clickRate) { this.clickRate = clickRate; }
}
