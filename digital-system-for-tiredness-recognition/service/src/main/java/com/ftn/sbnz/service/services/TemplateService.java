package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.models.Template;
import com.ftn.sbnz.model.models.TirednessTemplateModel;
import com.ftn.sbnz.model.models.enums.ActivityType;
import org.drools.template.ObjectDataCompiler;
import org.kie.api.KieServices;
import org.kie.api.builder.Message;
import org.kie.api.builder.Results;
import org.kie.api.io.ResourceType;
import org.kie.api.runtime.KieSession;
import org.kie.internal.utils.KieHelper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class TemplateService {
    
    // Za sada čuvamo u memoriji, kasnije možemo dodati bazu
    private Map<Long, Template> userTemplates = new HashMap<>();
    private Template defaultTemplate;
    
    public TemplateService() {
        // Kreiraj default template
        this.defaultTemplate = Template.createDefault();
        System.out.println("TemplateService initialized with default template");
    }
    
    /**
     * Vraća template za korisnika ili default ako korisnik nema svoj
     */
    public Template getUserTemplate(Long userId) {
        return userTemplates.getOrDefault(userId, defaultTemplate);
    }
    
    /**
     * Čuva ili ažurira template za korisnika
     */
    public Template saveUserTemplate(Long userId, Template template) {
        template.setUserId(userId);
        userTemplates.put(userId, template);
        System.out.println("Template saved for user: " + userId);
        return template;
    }
    
    /**
     * Vraća default template
     */
    public Template getDefaultTemplate() {
        return defaultTemplate;
    }
    
    /**
     * Reset korisničkog template-a na default
     */
    public Template resetToDefault(Long userId) {
        Template userDefault = Template.createDefault();
        userDefault.setUserId(userId);
        userTemplates.put(userId, userDefault);
        return userDefault;
    }
    
    /**
     * Proverava da li korisnik ima custom template
     */
    public boolean hasCustomTemplate(Long userId) {
        return userTemplates.containsKey(userId);
    }
    
    /**
     * Generiše dinamička pravila na osnovu korisničkog template-a
     */
    public String generateDynamicRules(Long userId) {
        try {
            // 1. Učitaj template za korisnika
            Template userTemplate = getUserTemplate(userId);
            
            // 2. Kreiraj template podatke na osnovu korisničkih podešavanja
            List<TirednessTemplateModel> templateData = generateTemplateDataFromUserSettings(userTemplate);
            
            if (templateData.isEmpty()) {
                System.err.println("ERROR: No template data generated from user settings!");
                return "";
            }
            
            System.out.println("Preparing to generate rules for " + templateData.size() + " template entries based on user settings");

            // 3. Učitaj .drt template
            InputStream template = getClass().getResourceAsStream("/templates/tiredness-template.drt");
            if (template == null) {
                throw new RuntimeException("Template file not found at /templates/tiredness-template.drt!");
            }
            
            // Reset stream for compiler
            template = getClass().getResourceAsStream("/templates/tiredness-template.drt");
            
            // 4. Generiši DRL kod
            ObjectDataCompiler converter = new ObjectDataCompiler();
            String generatedDRL = converter.compile(templateData, template);
            
            if (generatedDRL == null || generatedDRL.isEmpty()) {
                System.err.println("ERROR: Generated DRL is empty!");
                return "";
            }

            System.out.println("Generated DRL for user " + userId + ":\n" + generatedDRL);
            return generatedDRL;

        } catch (Exception e) {
            System.err.println("Error generating dynamic rules: " + e.getMessage());
            e.printStackTrace();
            return "";
        }
    }
    
    /**
     * Generiše template podatke na osnovu korisničkih podešavanja
     */
    private List<TirednessTemplateModel> generateTemplateDataFromUserSettings(Template userTemplate) {
        List<TirednessTemplateModel> templateData = new ArrayList<>();
        
        System.out.println("Generating template data from user settings: " +
                        "workLow=" + userTemplate.getWorkLowThreshold() +
                        ", workMedium=" + userTemplate.getWorkMediumThreshold() +
                        ", workHigh=" + userTemplate.getWorkHighThreshold() +
                        ", entertainmentLow=" + userTemplate.getEntertainmentLowThreshold() +
                        ", entertainmentMedium=" + userTemplate.getEntertainmentMediumThreshold() +
                        ", entertainmentHigh=" + userTemplate.getEntertainmentHighThreshold());
        
        // WORK pravila na osnovu korisničkih pragova
        if (userTemplate.isEnableLowAction()) {
            templateData.add(new TirednessTemplateModel(
                ActivityType.WORK,
                0,
                userTemplate.getWorkMediumThreshold() - 1,
                "LOW",
                "Radite već " + userTemplate.getWorkLowThreshold() + " minuta. Kratka pauza od 5-10 minuta se preporučuje.",
                true
            ));
        }
        
        if (userTemplate.isEnableMediumAction()) {
            templateData.add(new TirednessTemplateModel(
                ActivityType.WORK,
                userTemplate.getWorkMediumThreshold(),
                userTemplate.getWorkHighThreshold() - 1,
                "MEDIUM",
                "Radite duže od " + userTemplate.getWorkMediumThreshold() + " minuta bez prekida. Potrebna je pauza od 15-20 minuta.",
                true
            ));
        }
        
        if (userTemplate.isEnableHighAction()) {
            templateData.add(new TirednessTemplateModel(
                ActivityType.WORK,
                userTemplate.getWorkHighThreshold(),
                1440, // max minuta u danu
                "HIGH",
                "Kritično! Radite preko " + userTemplate.getWorkHighThreshold() + " minuta bez prekida. Obavezna pauza minimum 30 minuta!",
                true
            ));
        }
        
        // ENTERTAINMENT pravila na osnovu korisničkih pragova
        if (userTemplate.isEnableLowAction()) {
            templateData.add(new TirednessTemplateModel(
                ActivityType.ENTERTAINMENT,
                userTemplate.getEntertainmentLowThreshold(),
                userTemplate.getEntertainmentMediumThreshold() - 1,
                "LOW",
                "Provodite previše vremena na zabavi (" + userTemplate.getEntertainmentLowThreshold() + "+ minuta). Predlog: aktivan odmor.",
                true
            ));
        }
        
        if (userTemplate.isEnableMediumAction()) {
            templateData.add(new TirednessTemplateModel(
                ActivityType.ENTERTAINMENT,
                userTemplate.getEntertainmentMediumThreshold(),
                userTemplate.getEntertainmentHighThreshold() - 1,
                "MEDIUM",
                "Dugo pasivno korišćenje ekrana (" + userTemplate.getEntertainmentMediumThreshold() + "+ minuta). Ograničite vreme zabave i izađite napolje.",
                true
            ));
        }
        
        if (userTemplate.isEnableHighAction()) {
            templateData.add(new TirednessTemplateModel(
                ActivityType.ENTERTAINMENT,
                userTemplate.getEntertainmentHighThreshold(),
                1440, // max minuta u danu
                "HIGH",
                "Kritično! Gledate u telefon " + userTemplate.getEntertainmentHighThreshold() + "+ minuta bez prekida. Obavezna pauza minimum 30 minuta!",
                true
            ));
        }
        
        // Ispis kreiranih template podataka za debug
        for (TirednessTemplateModel model : templateData) {
            System.out.println("Created rule template: " + model.getActivityType() + 
                               ", " + model.getMinDuration() + "-" + model.getMaxDuration() + 
                               " min, " + model.getRiskLevel() + 
                               ", enabled=" + model.isEnabled());
        }
        
        return templateData;
    }
    
    /**
     * Kreira KieSession sa dinamički generisanim pravilima
     */
    public KieSession createDynamicKieSession(Long userId) {
        String drl = generateDynamicRules(userId);

        if (drl.isEmpty()) {
            return null;
        }

        KieHelper kieHelper = new KieHelper();
        kieHelper.addContent(drl, ResourceType.DRL);

        Results results = kieHelper.verify();

        if (results.hasMessages(Message.Level.WARNING, Message.Level.ERROR)) {
            List<Message> messages = results.getMessages(Message.Level.WARNING, Message.Level.ERROR);
            for (Message message : messages) {
                System.err.println("Template compilation error: " + message.getText());
            }
            throw new IllegalStateException("Template compilation errors found!");
        }

        System.out.println("[PAYLOAD DEBUG] KieSession created for userId=" + userId);
        return kieHelper.build().newKieSession();
    }
    
    /**
     * Učitava template podatke iz CSV fajla
     */
    private List<TirednessTemplateModel> loadTemplateDataFromCsv() {
        List<TirednessTemplateModel> templateData = new ArrayList<>();
        String csvPath = "/templates/data/template-data.csv";
        try (InputStream is = getClass().getResourceAsStream(csvPath);
             BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                if (first) { first = false; continue; } // skip header
                String[] parts = line.split(",");
                if (parts.length < 6) {
                    System.err.println("Skipping invalid CSV line: " + line + " (not enough parts)");
                    continue;
                }
                
                try {
                    ActivityType activityType = com.ftn.sbnz.model.models.enums.ActivityType.valueOf(parts[0].trim());
                    int minDuration = Integer.parseInt(parts[1].trim());
                    int maxDuration = Integer.parseInt(parts[2].trim());
                    String riskLevel = parts[3].trim();
                    String message = parts[4].trim();
                    boolean enabled = Boolean.parseBoolean(parts[5].trim());
                    
                    TirednessTemplateModel model = new TirednessTemplateModel(
                        activityType,
                        minDuration,
                        maxDuration,
                        riskLevel,
                        message,
                        enabled
                    );
                    
                    templateData.add(model);
                    System.out.println("Loaded template row: " + activityType + ", " + minDuration + "-" + maxDuration + ", " + riskLevel);
                } catch (Exception e) {
                    System.err.println("Error parsing CSV line: " + line + " - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading template data from CSV: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("Loaded " + templateData.size() + " template rows from CSV");
        return templateData;
    }
}