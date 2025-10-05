package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.dto.TirednessReportDTO;
import com.ftn.sbnz.model.events.*;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import com.ftn.sbnz.model.models.Template;
import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.DeviceType;
import com.ftn.sbnz.model.models.enums.TirednessRisk;
import org.drools.core.time.SessionPseudoClock;
import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.KieSessionConfiguration;
import org.kie.api.runtime.conf.ClockTypeOption;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class TirednessService {

    private final KieContainer kieContainer;
    private final TemplateService templateService;

    private KieSession mainKieSession;
    private KieSession cepKieSession;
    private KieSession backwardKieSession;
    private KieSession templateKieSession;

    public TirednessService(KieContainer kieContainer, TemplateService templateService) {
        this.kieContainer = kieContainer;
        this.templateService = templateService;
        this.mainKieSession = kieContainer.newKieSession("mainKSession");

        KieSessionConfiguration config = KieServices.Factory.get().newKieSessionConfiguration();
        config.setOption(ClockTypeOption.get("pseudo"));
        this.cepKieSession = kieContainer.newKieSession("cepKSession", config);

        this.backwardKieSession = kieContainer.newKieSession("backwardKSession");
        this.templateKieSession = kieContainer.newKieSession("templateKSession");
    }

    public void initSessions(List<Session> sessions) {
        // Reset i reinicijalizacija svih KieSession-a za čistu simulaciju
        resetAllKieSessions();
        
        System.out.println("INIT SESSIONS: Received " + sessions.size() + " sessions");
        for (Session session : sessions) {
            System.out.println("Inserting session: " + session.getSessionId());
            mainKieSession.insert(session);
        
            for (ActivityEvent activityEvent : session.getActivityEvents()) {
                backwardKieSession.insert(activityEvent);
                insertDerivedEvents(activityEvent);
                
                // Process template rules for each activity event during initialization
                processTemplateRules(session, activityEvent);
            }
        }

        cepKieSession.fireAllRules();

        cepKieSession.getObjects(obj -> obj instanceof FocusDropEvent
                        || obj instanceof PassiveBingeEvent
                        || obj instanceof NoBreakStreakEvent
                        || obj instanceof MultiTaskOverloadEvent
                        || obj instanceof EarlyFatigueSignal
                        || obj instanceof MentalFatigueSignal
                        || obj instanceof HighRiskTodaySignal)
                .forEach(mainKieSession::insert);

        mainKieSession.fireAllRules();
        
        // Filter generated recommendations based on template settings for all sessions
        for (Session session : sessions) {
            Template userTemplate = templateService.getUserTemplate(session.getUserId());
            
            // Get all recommendations for this session from main rules
            List<Recommendation> mainRecommendations = mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                    .stream()
                    .map(obj -> (Recommendation)obj)
                    .filter(rec -> rec.getSessionId() == session.getSessionId())
                    .collect(Collectors.toList());
            
            // Get template recommendations for this session
            List<Recommendation> templateRecommendations = templateKieSession.getObjects(obj -> obj instanceof Recommendation)
                    .stream()
                    .map(obj -> (Recommendation)obj)
                    .filter(rec -> rec.getSessionId() == session.getSessionId())
                    .collect(Collectors.toList());
            
            // Remove non-allowed recommendations from both sessions
            List<Recommendation> toRemoveFromMain = mainRecommendations.stream()
                    .filter(rec -> !isRecommendationAllowedByTemplate(rec, userTemplate))
                    .collect(Collectors.toList());
                    
            List<Recommendation> toRemoveFromTemplate = templateRecommendations.stream()
                    .filter(rec -> !isRecommendationAllowedByTemplate(rec, userTemplate))
                    .collect(Collectors.toList());
            
            // Remove filtered recommendations from KieSession
            for (Recommendation rec : toRemoveFromMain) {
                mainKieSession.delete(mainKieSession.getFactHandle(rec));
            }
            for (Recommendation rec : toRemoveFromTemplate) {
                templateKieSession.delete(templateKieSession.getFactHandle(rec));
            }
            
            System.out.println("Session " + session.getSessionId() + ": Removed " + 
                             (toRemoveFromMain.size() + toRemoveFromTemplate.size()) + 
                             " recommendations based on template settings");
        }
        
        // Debug: Check if sessions still exist after fireAllRules
        List<Session> sessionsAfterFire = mainKieSession.getObjects(obj -> obj instanceof Session)
                .stream()
                .map(obj -> (Session) obj)
                .collect(Collectors.toList());
        System.out.println("INIT SESSIONS COMPLETE: Sessions remaining: " + sessionsAfterFire.size());
        for (Session s : sessionsAfterFire) {
            System.out.println("  - Session still exists: " + s.getSessionId());
        }
    }

    public Session getSessionById(Long sessionId) {
        List<Session> allSessions = mainKieSession.getObjects(obj -> obj instanceof Session)
                .stream()
                .map(obj -> (Session) obj)
                .collect(Collectors.toList());
        
        System.out.println("GET SESSION BY ID: Looking for sessionId=" + sessionId);
        System.out.println("Available sessions in KieSession: " + allSessions.size());
        for (Session s : allSessions) {
            System.out.println("  - Session: " + s.getSessionId());
        }
        
    return allSessions.stream()
        .filter(session -> session.getSessionId() != null && session.getSessionId().equals(sessionId))
        .findFirst()
        .orElse(null);
    }

    public List<Recommendation> processEvent(ActivityEvent event) {
    System.out.println("PROCESS EVENT: Event sessionId=" + event.getSessionId());
    Session session = getSessionById(event.getSessionId());
    if (session == null) {
        System.out.println("ERROR: Session not found for event with sessionId=" + event.getSessionId());
        throw new IllegalStateException("Session with id " + event.getSessionId() + " not found. Please start a new session before adding events.");
    }
    System.out.println("Found session for event: " + session.getSessionId());
    session.getActivityEvents().add(event);
    mainKieSession.update(mainKieSession.getFactHandle(session), session);
    processTemplateRules(session, event);
    insertDerivedEvents(event);

    cepKieSession.fireAllRules();

    cepKieSession.getObjects(obj -> obj instanceof FocusDropEvent
            || obj instanceof PassiveBingeEvent
            || obj instanceof NoBreakStreakEvent
            || obj instanceof MultiTaskOverloadEvent
            || obj instanceof EarlyFatigueSignal
            || obj instanceof MentalFatigueSignal
            || obj instanceof HighRiskTodaySignal)
        .forEach(mainKieSession::insert);

    mainKieSession.fireAllRules();

    List<Recommendation> mainRecommendations = mainKieSession.getObjects(obj -> obj instanceof Recommendation)
        .stream()
        .map(obj -> (Recommendation)obj)
        .filter(rec -> rec.getSessionId() == event.sessionId)
        .collect(Collectors.toList());
                
    List<Recommendation> templateRecommendations = templateKieSession.getObjects(obj -> obj instanceof Recommendation)
        .stream()
        .map(obj -> (Recommendation)obj)
        .filter(rec -> rec.getSessionId() == event.sessionId)
        .collect(Collectors.toList());
        
    mainRecommendations.addAll(templateRecommendations);
        
    // Filter recommendations based on template settings
    Template userTemplate = templateService.getUserTemplate(session.getUserId());
    List<Recommendation> filteredRecommendations = mainRecommendations.stream()
        .filter(rec -> isRecommendationAllowedByTemplate(rec, userTemplate))
        .sorted(Comparator.comparingInt(rec -> rec.getRiskLevel().ordinal()))
        .collect(Collectors.toList());
        
    System.out.println("Total recommendations before filtering: " + mainRecommendations.size());
    System.out.println("Filtered recommendations: " + filteredRecommendations.size());
        
    return filteredRecommendations;
    }
    
    private void processTemplateRules(Session session, ActivityEvent event) {
        Template userTemplate = templateService.getUserTemplate(session.getUserId());
        
        templateKieSession.insert(userTemplate);
        templateKieSession.insert(session);
        templateKieSession.insert(event);
        
        templateKieSession.fireAllRules();
        
        System.out.println("Template rules processed for user: " + session.getUserId() + 
                          " with template: " + userTemplate.getName());
    }


    private void insertDerivedEvents(ActivityEvent activityEvent) {
        long sessionId = activityEvent.getSessionId();
        SessionPseudoClock clock = cepKieSession.getSessionClock();

        if (activityEvent.getActivityType() == ActivityType.WORK
                && activityEvent.getTypingSpeed() > 0) {
            System.out.println("CREATE KEY STROKE");
            KeyStrokeEvent keyStrokeEvent = new KeyStrokeEvent(
                    sessionId,
                    activityEvent.getStartTimestamp(),
                    activityEvent.getTypingSpeed(),
                    activityEvent.getErrors()
            );
            cepKieSession.insert(keyStrokeEvent);
            clock.advanceTime(keyStrokeEvent.getTs() - clock.getCurrentTime(), TimeUnit.MILLISECONDS);
        }


        if (activityEvent.getActivityType() == ActivityType.ENTERTAINMENT) {
            System.out.println("CREATE APP FOCUS EVENT");
            AppFocusEvent appFocusEvent = new AppFocusEvent(
                    sessionId,
                    activityEvent.category,
                    activityEvent.getStartTimestamp(),
                    activityEvent.getActivityDuration()
            );
            cepKieSession.insert(appFocusEvent);
            clock.advanceTime(appFocusEvent.getTs() - clock.getCurrentTime(), TimeUnit.MILLISECONDS);
        }

        if (activityEvent.getBreakDuration() >= 0) {
            System.out.println("CREATE USER ACTIVE EVENT");
            UserActiveEvent activeEvent = new UserActiveEvent(
                    sessionId,
                    activityEvent.getStartTimestamp(),
                    activityEvent.getActivityDuration(),
                    activityEvent.getBreakDuration()
            );
            cepKieSession.insert(activeEvent);
            clock.advanceTime(activeEvent.getTs() - clock.getCurrentTime(), TimeUnit.MILLISECONDS);
        }

    }


    public List<Recommendation> getRecommendationsForSession(long sessionId) {
        List<Recommendation> mainRecommendations = mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation) obj)
                .filter(rec -> rec.getSessionId() == sessionId)
                .collect(Collectors.toList());
                
        List<Recommendation> templateRecommendations = templateKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation) obj)
                .filter(rec -> rec.getSessionId() == sessionId)
                .collect(Collectors.toList());
        
        mainRecommendations.addAll(templateRecommendations);
        
        // Filter recommendations based on template settings
        Session session = getSessionById(sessionId);
        if (session != null) {
            Template userTemplate = templateService.getUserTemplate(session.getUserId());
            return mainRecommendations.stream()
                    .filter(rec -> isRecommendationAllowedByTemplate(rec, userTemplate))
                    .sorted(Comparator.comparingInt(rec -> rec.getRiskLevel().ordinal()))
                    .collect(Collectors.toList());
        }
        
        return mainRecommendations.stream()
                .sorted(Comparator.comparingInt(rec -> rec.getRiskLevel().ordinal()))
                .collect(Collectors.toList());
    }

    public Recommendation backwardChaining(TirednessReportDTO report) {
        backwardKieSession.insert(report);
        backwardKieSession.fireAllRules();

        backwardKieSession.fireAllRules();

        List<Recommendation> recommendations = backwardKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation) obj)
                .sorted(Comparator.comparingInt(r -> r.getRiskLevel().ordinal()))
                .map(obj -> (Recommendation)obj)
                .collect(Collectors.toList());

        return recommendations.isEmpty() ? null : recommendations.get(0);
    }

    /**
     * Reset i reinicijalizacija svih KieSession-a za čistu simulaciju
     */
    private void resetAllKieSessions() {
        System.out.println("Resetting all KieSession instances for fresh simulation...");
        
        // Dispose postojeće session-e ako postoje
        if (mainKieSession != null) {
            mainKieSession.dispose();
        }
        if (cepKieSession != null) {
            cepKieSession.dispose();
        }
        if (backwardKieSession != null) {
            backwardKieSession.dispose();
        }
        if (templateKieSession != null) {
            templateKieSession.dispose();
        }
        
        // Kreiraj nove čiste session-e
        this.mainKieSession = kieContainer.newKieSession("mainKSession");
        
        KieSessionConfiguration config = KieServices.Factory.get().newKieSessionConfiguration();
        config.setOption(ClockTypeOption.get("pseudo"));
        this.cepKieSession = kieContainer.newKieSession("cepKSession", config);
        
        this.backwardKieSession = kieContainer.newKieSession("backwardKSession");
        this.templateKieSession = kieContainer.newKieSession("templateKSession");
        
        System.out.println("All KieSession instances reset successfully.");
    }

    public String endSession() {
        try {
            if (mainKieSession != null) {
                mainKieSession.dispose();
                mainKieSession = null;
            }

            if (cepKieSession != null) {
                cepKieSession.dispose();
                cepKieSession = null;
            }

            if (backwardKieSession != null) {
                backwardKieSession.dispose();
                backwardKieSession = null;
            }

            return "Successfully ended all sessions";
        } catch(Exception e) {
            e.printStackTrace();
            return "Failed to end sessions...";
        }
    }

    private boolean isRecommendationAllowedByTemplate(Recommendation recommendation, Template template) {
        TirednessRisk riskLevel = recommendation.getRiskLevel();
        String message = recommendation.getMessage().toLowerCase();
        
        System.out.println("Checking recommendation with risk level: " + riskLevel + 
                          " and message: '" + recommendation.getMessage() + "'" +
                          " against template settings: " +
                          "Low=" + template.isEnableLowAction() + 
                          ", Medium=" + template.isEnableMediumAction() + 
                          ", High=" + template.isEnableHighAction());
        
        // Direct mapping - much simpler now with only 3 levels
        switch (riskLevel) {
            case LOW:    
                return template.isEnableLowAction();
                
            case MEDIUM: 
                return template.isEnableMediumAction();
                
            case HIGH:   
                return template.isEnableHighAction();
                
            default:
                return true; // Unknown risk level, allow by default
        }
    }

}
