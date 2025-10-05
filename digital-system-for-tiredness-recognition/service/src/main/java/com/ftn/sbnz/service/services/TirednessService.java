package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.events.*;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import com.ftn.sbnz.model.models.enums.ActivityType;
import com.ftn.sbnz.model.models.enums.DeviceType;
import org.drools.core.time.SessionPseudoClock;
import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.KieSessionConfiguration;
import org.kie.api.runtime.conf.ClockTypeOption;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class TirednessService {

    private final KieContainer kieContainer;

    private KieSession mainKieSession;
    private KieSession cepKieSession;

    public TirednessService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
        this.mainKieSession = kieContainer.newKieSession("mainKSession");

        KieSessionConfiguration config = KieServices.Factory.get().newKieSessionConfiguration();
        config.setOption(ClockTypeOption.get("pseudo"));
        this.cepKieSession = kieContainer.newKieSession("cepKsession", config);
    }

    public void initSessions(List<Session> sessions) {
        for (Session session : sessions) {
            mainKieSession.insert(session);

            for (ActivityEvent activityEvent : session.getActivityEvents()) {
                insertDerivedEvents(activityEvent);
            }
        }

        cepKieSession.fireAllRules();

        cepKieSession.getObjects(obj -> obj instanceof FocusDropEvent
                        || obj instanceof PassiveBingeEvent
                        || obj instanceof NoBreakStreakEvent
                        || obj instanceof MultiTaskOverloadEvent
                        || obj instanceof EarlyFatigueSignal
                        || obj instanceof MentalFatigueSignal)
                .forEach(mainKieSession::insert);


        mainKieSession.fireAllRules();
    }

    public List<Recommendation> processEvent(ActivityEvent event) {
        insertDerivedEvents(event);

        cepKieSession.fireAllRules();

        cepKieSession.getObjects(obj -> obj instanceof FocusDropEvent
                        || obj instanceof PassiveBingeEvent
                        || obj instanceof NoBreakStreakEvent
                        || obj instanceof MultiTaskOverloadEvent
                        || obj instanceof EarlyFatigueSignal
                        || obj instanceof MentalFatigueSignal)
                .forEach(mainKieSession::insert);

        mainKieSession.fireAllRules();

        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation)obj)
                .collect(Collectors.toList());
    }


    private void insertDerivedEvents(ActivityEvent activityEvent) {
        long sessionId = activityEvent.getSessionId();
        SessionPseudoClock clock = cepKieSession.getSessionClock();

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
            clock.advanceTime(keyStrokeEvent.getTs() - clock.getCurrentTime(), TimeUnit.MILLISECONDS);
        }


        if (activityEvent.getActivityType() == ActivityType.ENTERTAINMENT) {
            System.out.println("PRAVI APP FOCUS EVENT");
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
            System.out.println("PRAVI USER ACTIVE EVENT");
            UserActiveEvent activeEvent = new UserActiveEvent(
                    sessionId,
                    activityEvent.getStartTimestamp(),
                    activityEvent.getActivityDuration(),
                    activityEvent.getBreakDuration()
            );
            cepKieSession.insert(activeEvent);
            clock.advanceTime(activeEvent.getTs() - clock.getCurrentTime(), TimeUnit.MILLISECONDS);
        }

//        ScreenTimeEvent screenTimeEvent = new ScreenTimeEvent(
//                activityEvent.getStartTimestamp(),
//                activityEvent.getDeviceType() == DeviceType.COMPUTING_DEVICE ? "COMPUTER" : "PHONE",
//                activityEvent.getActivityDuration()
//        );
//        cepKieSession.insert(screenTimeEvent);
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
