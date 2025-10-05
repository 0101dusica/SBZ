package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.events.*;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.DeviceType;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TirednessService {

    private final KieContainer kieContainer;
//    private KieSession kieSession;

    private KieSession mainKieSession;
    private KieSession cepKieSession;

//    public TirednessService(KieContainer kieContainer) {
//        this.kieContainer = kieContainer;
//    }

    public TirednessService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
        this.mainKieSession = kieContainer.newKieSession("mainKSession");
        this.cepKieSession = kieContainer.newKieSession("cepKsession");
    }

    public void addSessions(List<Session> sessions) {
        for (Session session : sessions) {
            // 1) Insert u mainKieSession (za same ActivityEvent i Session podatke)
            mainKieSession.insert(session);

            // 2) Insert ActivityEvent u CEP + derivacije
            for (ActivityEvent activityEvent : session.getActivityEvents()) {
                insertDerivedEvents(activityEvent);
            }
        }

        // 3) CEP prvo izvršava pravila i kreira signal eventove
        cepKieSession.fireAllRules();

        // 4) Ubaci signale iz CEP sesije u mainKieSession
        cepKieSession.getObjects(obj -> obj instanceof FocusDropEvent
                        || obj instanceof PassiveBingeEvent
                        || obj instanceof NoBreakStreakEvent
                        || obj instanceof MultiTaskOverloadEvent
                        || obj instanceof EarlyFatigueSignal
                        || obj instanceof MentalFatigueSignal)
                .forEach(mainKieSession::insert);

        // 5) FireAllRules na mainKieSession za generisanje preporuka
        mainKieSession.fireAllRules();
    }

    public List<Recommendation> processEvent(ActivityEvent event) {
        insertDerivedEvents(event);

        // 1) CEP prvo
        cepKieSession.fireAllRules();

        // 2) Ubaci signale u mainKieSession
        cepKieSession.getObjects(obj -> obj instanceof FocusDropEvent
                        || obj instanceof PassiveBingeEvent
                        || obj instanceof NoBreakStreakEvent
                        || obj instanceof MultiTaskOverloadEvent
                        || obj instanceof EarlyFatigueSignal
                        || obj instanceof MentalFatigueSignal)
                .forEach(mainKieSession::insert);

        // 3) Glavna sesija
        mainKieSession.fireAllRules();

        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation)obj)
                .collect(Collectors.toList());
    }


    private void insertDerivedEvents(ActivityEvent activityEvent) {
        long sessionId = activityEvent.getSessionId();

        // 1) Ako je tipkanje (WORK sa typingSpeed > 0)
        if (activityEvent.getActivityType() == ActivityType.WORK
                && activityEvent.getTypingSpeed() > 0) {
            System.out.println("PRAVI KEY STROKE");
            KeyStrokeEvent keyStrokeEvent = new KeyStrokeEvent(
                    sessionId,
                    activityEvent.getStartTimestamp(),
                    activityEvent.getTypingSpeed(),
                    activityEvent.getErrors()
            );
            cepKieSession.insert(keyStrokeEvent);
        }

        // 2) Ako je entertainment/social
        if (activityEvent.getActivityType() == ActivityType.ENTERTAINMENT) {
            System.out.println("PRAVI APP FOCUS EVENT");
            AppFocusEvent appFocusEvent = new AppFocusEvent(
                    sessionId,
                    "ENTERTAINMENT",
                    activityEvent.getStartTimestamp(),
                    activityEvent.getActivityDuration()
            );
            cepKieSession.insert(appFocusEvent);
        }

        // 3) Ako ima break (breakDuration >= 0)
        if (activityEvent.getBreakDuration() >= 0) {
            System.out.println("PRAVI BREAK EVENT");
            UserBreakEvent userBreakEvent = new UserBreakEvent(
                    sessionId,
                    activityEvent.getStartTimestamp(),
                    activityEvent.getBreakDuration()
            );
            cepKieSession.insert(userBreakEvent);
        }

        ScreenTimeEvent screenTimeEvent = new ScreenTimeEvent(
                activityEvent.getStartTimestamp(),
                activityEvent.getDeviceType() == DeviceType.COMPUTING_DEVICE ? DeviceType.COMPUTING_DEVICE : DeviceType.PHONE_DEVICE,
                activityEvent.getActivityDuration()
        );
        cepKieSession.insert(screenTimeEvent);
    }


    public List<Recommendation> getRecommendationsForSession(long sessionId) {
        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation)obj)
                .filter(rec -> rec.getSessionId() == sessionId)
                .collect(Collectors.toList());
    }

//    public List<Recommendation> getRecommendationsForUser(long userId) {
//        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
//                .stream()
//                .map(obj -> (Recommendation)obj)
//                .filter(rec -> rec.getSessionId() == sessionId)
//                .collect(Collectors.toList());
//    }


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

            return "Successfully ended all sessions";
        } catch(Exception e) {
            e.printStackTrace();
            return "Failed to end sessions...";
        }
    }



}
