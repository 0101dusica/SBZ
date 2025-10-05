package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.dto.TirednessReportDTO;
import com.ftn.sbnz.model.events.*;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
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

    private KieSession mainKieSession;
    private KieSession cepKieSession;
    private KieSession backwardKieSession;

    public TirednessService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
        this.mainKieSession = kieContainer.newKieSession("mainKSession");

        KieSessionConfiguration config = KieServices.Factory.get().newKieSessionConfiguration();
        config.setOption(ClockTypeOption.get("pseudo"));
        this.cepKieSession = kieContainer.newKieSession("cepKSession", config);

        this.backwardKieSession = kieContainer.newKieSession("backwardKSession");
    }

    public void initSessions(List<Session> sessions) {
        for (Session session : sessions) {
            System.out.println("Inserting session: " + session.getSessionId() +
                    " for user: " + session.getUserId() +
                    " with mainKieSession: " + mainKieSession);
            mainKieSession.insert(session);
            System.out.println("Session: " + mainKieSession.getObjects(obj -> obj instanceof Session)
                    .stream()
                    .map(obj -> (Session) obj)
                    .filter(session1 -> session1.getSessionId() == 11)
                    .findFirst()
                    .orElse(null)
            );

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
                        || obj instanceof MentalFatigueSignal
                        || obj instanceof HighRiskTodaySignal)
                .forEach(mainKieSession::insert);


        mainKieSession.fireAllRules();
    }

    public Session getSessionById(Long sessionId) {
        return mainKieSession.getObjects(obj -> obj instanceof Session)
                .stream()
                .map(obj -> (Session) obj)
                .filter(session -> session.getSessionId() == sessionId)
                .findFirst()
                .orElse(null);
    }


    public List<Recommendation> processEvent(ActivityEvent event) {
        Session session = getSessionById(event.getSessionId());
        if (session != null) {
            session.getActivityEvents().add(event);
            mainKieSession.update(mainKieSession.getFactHandle(session), session);
        }
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

        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation)obj)
                .filter(rec -> rec.getSessionId() == event.sessionId)
                .sorted(Comparator.comparingInt(rec -> rec.getRiskLevel().ordinal()))
                .collect(Collectors.toList());
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
        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation) obj)
                .filter(rec -> rec.getSessionId() == sessionId)
                .sorted(Comparator.comparingInt(rec -> rec.getRiskLevel().ordinal()))
                .collect(Collectors.toList());
    }


//    public List<Recommendation> getRecommendationsForUser(long userId) {
//        return mainKieSession.getObjects(obj -> obj instanceof Recommendation)
//                .stream()
//                .map(obj -> (Recommendation)obj)
//                .filter(rec -> rec.getSessionId() == sessionId)
//                .collect(Collectors.toList());
//    }

    public Recommendation backwardChaining(TirednessReportDTO report) {
        backwardKieSession.insert(report);

        List<ActivityEvent> events = mainKieSession.getObjects(obj -> obj instanceof Session)
                .stream()
                .map(obj -> (Session) obj)
                .filter(s -> s.getSessionId() == report.sessionId)
                .flatMap(s -> s.getActivityEvents().stream())
                .collect(Collectors.toList());

        for (ActivityEvent event : events) {
            backwardKieSession.insert(event);
        }

        backwardKieSession.fireAllRules();

        List<Recommendation> recommendations = backwardKieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation) obj)
                .sorted(Comparator.comparingInt(r -> r.getRiskLevel().ordinal()))
                .map(obj -> (Recommendation)obj)
                .collect(Collectors.toList());

        return recommendations.isEmpty() ? null : recommendations.get(0);
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



}
