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
    public long sessionId;
    public long userId;
    public long startTimestamp;
    public long endTimestamp;
    public int subjectiveTirednessLevel;
    public List<String> risks = new ArrayList<>();
    public int riskLevel;
    public List<ActivityEvent> activityEvents = new ArrayList<>();
}
