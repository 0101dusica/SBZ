package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.events.ActivityEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    private long sessionId;
    private long userId;
    private long startTimestamp;
    private long endTimestamp;
    private int subjectiveTirednessLevel;
    private List<String> risks = new ArrayList<>();
    private int riskLevel;
    private List<ActivityEvent> activityEvents = new ArrayList<>();
}
