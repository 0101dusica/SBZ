package com.ftn.sbnz.service.controllers;

import com.ftn.sbnz.model.models.Template;
import com.ftn.sbnz.service.services.TemplateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = {"http://localhost:4200"})
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    /**
     * Dobija template za korisnika
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Template> getUserTemplate(@PathVariable Long userId) {
        Template template = templateService.getUserTemplate(userId);
        return ResponseEntity.ok(template);
    }

    /**
     * Čuva template za korisnika
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<Template> saveUserTemplate(@PathVariable Long userId, @RequestBody Template template) {
        Template savedTemplate = templateService.saveUserTemplate(userId, template);
        
        // After saving, regenerate the dynamic rules
        try {
            templateService.createDynamicKieSession(userId);
            System.out.println("Dynamic rules regenerated after template update for user " + userId);
        } catch (Exception e) {
            System.err.println("Failed to regenerate dynamic rules after template update: " + e.getMessage());
        }
        
        return ResponseEntity.ok(savedTemplate);
    }

    /**
     * Vraća default template
     */
    @GetMapping("/default")
    public ResponseEntity<Template> getDefaultTemplate() {
        Template template = templateService.getDefaultTemplate();
        return ResponseEntity.ok(template);
    }

    /**
     * Reset na default template
     */
    @PostMapping("/user/{userId}/reset")
    public ResponseEntity<Template> resetToDefault(@PathVariable Long userId) {
        Template template = templateService.resetToDefault(userId);
        return ResponseEntity.ok(template);
    }

    /**
     * Proverava da li korisnik ima custom template
     */
    @GetMapping("/user/{userId}/has-custom")
    public ResponseEntity<Boolean> hasCustomTemplate(@PathVariable Long userId) {
        boolean hasCustom = templateService.hasCustomTemplate(userId);
        return ResponseEntity.ok(hasCustom);
    }
    
    /**
     * Generiše dinamička pravila za korisnika
     */
    @GetMapping("/user/{userId}/generate-rules")
    public ResponseEntity<String> generateDynamicRules(@PathVariable Long userId) {
        String drl = templateService.generateDynamicRules(userId);
        return ResponseEntity.ok(drl);
    }
    
    /**
     * Testira kreiranje dinamičkog KieSession-a za korisnika
     */
    @PostMapping("/user/{userId}/test-dynamic-session")
    public ResponseEntity<String> testDynamicSession(@PathVariable Long userId) {
        try {
            org.kie.api.runtime.KieSession session = templateService.createDynamicKieSession(userId);
            if (session != null) {
                session.dispose();
                return ResponseEntity.ok("Dynamic KieSession created successfully for user " + userId);
            } else {
                return ResponseEntity.badRequest().body("Failed to create dynamic KieSession for user " + userId);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating dynamic session: " + e.getMessage());
        }
    }
}