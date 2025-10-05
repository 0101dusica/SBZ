package com.ftn.sbnz.model.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Template {
    private Long id;
    private Long userId;
    private String name;
    
    // Osnovni pragovi (u minutima)
    private int workBreakThreshold = 90;           // Upozorenje za rad bez pauze
    private int entertainmentThreshold = 60;       // Prag za pasivno korišćenje
    private int focusDropThreshold = 25;           // Pad koncentracije (procenat)
    private int errorRateThreshold = 40;           // Povećanje grešaka (procenat)
    
    // CEP pragovi
    private int noBreakStreakMinutes = 90;         // Dugotrajni rad bez pauze
    private int appSwitchCount = 30;               // Broj prelaza aplikacija za multitasking
    private int passiveBingeMinutes = 120;         // Pasivno korišćenje društvenih mreža
    
    // Akcije po nivoima umora (1-5)
    private boolean enableLevel1Action = false;     // Nivo 1: Ignoriši
    private boolean enableLevel2Action = false;     // Nivo 2: Blago upozorenje
    private boolean enableLevel3Action = true;      // Nivo 3: Preporuči kratku pauzu
    private boolean enableLevel4Action = true;      // Nivo 4: Preporuči dužu pauzu
    private boolean enableLevel5Action = true;      // Nivo 5: Intenzivno upozorenje
    
    // Integracija uređaja
    private boolean combineDevices = true;          // Da li sabirati vreme računar+telefon
    
    // Konstruktor za default template
    public static Template createDefault() {
        Template template = new Template();
        template.setId(1L);
        template.setUserId(0L); // Default za sve korisnike
        template.setName("Default Template");
        return template;
    }
}