package com.ftn.sbnz.model.enums;

public enum RecommendationType {
    TAKE_BREAK("Preporučuje se pauza"),
    MICRO_BREAK("Kratka pauza"),
    FOCUS_TIME("Vreme za fokusiranje"),
    HYDRATION("Hidratacija"),
    EYE_EXERCISE("Vežbe za oči"),
    POSTURE_CHECK("Provera položaja tela");

    private final String description;

    RecommendationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
