package com.ftn.sbnz.service.tests;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ftn.sbnz.model.events.ActivityEvent;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Template;
import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.DeviceType;
import com.ftn.sbnz.model.models.enums.TirednessRisk;
import com.ftn.sbnz.service.services.TemplateService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TemplateRulesTest {

    @Autowired
    private TemplateService templateService;

    @Test
    public void testDynamicTemplateGeneration() {
        // Test generisanja dinamičkih pravila
        String drl = templateService.generateDynamicRules(1L);
        
        assertNotNull("DRL should be generated", drl);
        assertFalse("DRL should not be empty", drl.isEmpty());
        assertTrue("DRL should contain rule", drl.contains("rule"));
        assertTrue("DRL should contain ActivityEvent", drl.contains("ActivityEvent"));
        
        System.out.println("Generated DRL:\n" + drl);
    }

    @Test 
    public void testTemplateWithDefaultSettings() {
        // Testiranje sa default template podešavanjima
        KieSession kieSession = templateService.createDynamicKieSession(1L);
        assertNotNull("KieSession should be created", kieSession);
        
        // Kreiraj test event - rad od 95 minuta (preko default praga od 90)
        ActivityEvent workEvent = new ActivityEvent(
            1L, 1L, ActivityType.WORK, DeviceType.COMPUTING_DEVICE,
            System.currentTimeMillis() - 95 * 60 * 1000,
            System.currentTimeMillis(),
            95, 0, 300, 2, "development"
        );
        
        kieSession.insert(workEvent);
        int rulesTriggered = kieSession.fireAllRules();
        
        assertTrue("At least one rule should be triggered", rulesTriggered > 0);
        
        // Proveri da li je generisana preporuka
        List<Recommendation> recommendations = new ArrayList<>();
        kieSession.getObjects().forEach(obj -> {
            if (obj instanceof Recommendation) {
                recommendations.add((Recommendation) obj);
            }
        });
        
        assertFalse("Should have recommendations", recommendations.isEmpty());
        
        Recommendation rec = recommendations.get(0);
        assertEquals("Should be for session 1", (Long) 1L, rec.getSessionId());
        assertNotNull("Should have message", rec.getMessage());
        
        System.out.println("Generated recommendation: " + rec.getMessage());
        
        kieSession.dispose();
    }

    @Test
    public void testTemplateWithCustomSettings() {
        // Kreiraj custom template za korisnika 2
        Template customTemplate = Template.createDefault();
        customTemplate.setWorkLowThreshold(30);      // Strožiji pragovi
        customTemplate.setWorkMediumThreshold(60);
        customTemplate.setWorkHighThreshold(90);
        customTemplate.setEntertainmentLowThreshold(20);
        customTemplate.setEntertainmentMediumThreshold(40);
        customTemplate.setEntertainmentHighThreshold(60);
        
        templateService.saveUserTemplate(2L, customTemplate);
        
        // Test sa custom podešavanjima
        KieSession kieSession = templateService.createDynamicKieSession(2L);
        assertNotNull("KieSession should be created", kieSession);
        
        // Event od 65 minuta rada (preko custom medium praga od 60)
        ActivityEvent workEvent = new ActivityEvent(
            2L, 2L, ActivityType.WORK, DeviceType.COMPUTING_DEVICE,
            System.currentTimeMillis() - 65 * 60 * 1000,
            System.currentTimeMillis(),
            65, 0, 280, 3, "coding"
        );
        
        kieSession.insert(workEvent);
        int rulesTriggered = kieSession.fireAllRules();
        
        assertTrue("Rules should be triggered for custom template", rulesTriggered > 0);
        
        // Proveri da li je generisana preporuka sa custom pragom
        List<Recommendation> recommendations = new ArrayList<>();
        kieSession.getObjects().forEach(obj -> {
            if (obj instanceof Recommendation) {
                recommendations.add((Recommendation) obj);
            }
        });
        
        assertFalse("Should have recommendations for custom template", recommendations.isEmpty());
        
        System.out.println("Custom template recommendation: " + recommendations.get(0).getMessage());
        
        kieSession.dispose();
    }
}