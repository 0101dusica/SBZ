package com.ftn.sbnz.model.enums;

public enum ActivityType {
    TYPING("Kucanje"),
    MOUSE_CLICK("Klik miša"),
    IDLE("Neaktivnost"),
    CONTEXT_SWITCH("Promena konteksta"),
    ERROR("Greška"),
    FOCUS_LOSS("Gubitak fokusa"),
    SCROLL("Skrolovanje"),
    KEY_COMBINATION("Kombinacija tastera");

    private final String description;

    ActivityType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
