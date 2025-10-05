package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.models.Template;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
}