package com.ftn.sbnz.model.events;

import java.io.Serializable;
import java.time.LocalDateTime;

public class AppFocusEvent implements Serializable {
    private LocalDateTime ts;
    private String app;
    private String category;

    public AppFocusEvent() {}
    public AppFocusEvent(LocalDateTime ts, String app, String category) {
        this.ts = ts;
        this.app = app;
        this.category = category;
    }
    public LocalDateTime getTs() { return ts; }
    public void setTs(LocalDateTime ts) { this.ts = ts; }
    public String getApp() { return app; }
    public void setApp(String app) { this.app = app; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
