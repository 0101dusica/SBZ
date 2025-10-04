package com.ftn.sbnz.model.models;

import com.ftn.sbnz.model.models.enums.TirednessRisk;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {
    private long sessionId;
    private String message;
    private TirednessRisk riskLevel;
}
