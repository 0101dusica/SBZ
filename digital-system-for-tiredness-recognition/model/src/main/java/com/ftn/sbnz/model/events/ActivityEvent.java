package com.ftn.sbnz.model.events;

import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEvent {
    private long id;
    private long sessionId;
    private ActivityType activityType;
    private DeviceType deviceType;
    private long startTimestamp;
    private long endTimestamp;
    private int activityDuration;
    private int breakDuration;
    private int typingSpeed;
    private int errors;
}
