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
    
    // WORK pragovi (u minutima)
    private int workLowThreshold = 60;             // Početak LOW upozorenja za rad
    private int workMediumThreshold = 90;          // Početak MEDIUM upozorenja za rad
    private int workHighThreshold = 180;           // Početak HIGH upozorenja za rad
    
    // ENTERTAINMENT pragovi (u minutima) 
    private int entertainmentLowThreshold = 90;    // Početak LOW upozorenja za zabavu
    private int entertainmentMediumThreshold = 150; // Početak MEDIUM upozorenja za zabavu
    private int entertainmentHighThreshold = 240;   // Početak HIGH upozorenja za zabavu
    
    // Dodatni pragovi
    private int focusDropThreshold = 25;           // Pad koncentracije (procenat)
    private int errorRateThreshold = 40;           // Povećanje grešaka (procenat)
    
    // CEP pragovi
    private int noBreakStreakMinutes = 90;         // Dugotrajni rad bez pauze
    private int appSwitchCount = 30;               // Broj prelaza aplikacija za multitasking
    private int passiveBingeMinutes = 120;         // Pasivno korišćenje društvenih mreža
    
    // Akcije po nivoima umora (1-3) - simplified
    private boolean enableLowAction = true;       // Nivo 1: Blagi umor - kratka pauza
    private boolean enableMediumAction = true;    // Nivo 2: Umeren umor - duža pauza  
    private boolean enableHighAction = true;      // Nivo 3: Visok umor - obavezna pauza
    
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