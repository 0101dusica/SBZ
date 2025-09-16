package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.events.ActivityEvent;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TirednessService {

    private final KieContainer kieContainer;
    private KieSession kieSession;

    public TirednessService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public void addSessions(List<Session> sessions) {
        this.kieSession = kieContainer.newKieSession("mainKSession");
        for (Session session : sessions) {
            kieSession.insert(session);
            for (ActivityEvent event : session.getActivityEvents()){
                kieSession.insert(event);
            }
        }
        kieSession.fireAllRules();
    }

    public List<Recommendation> processEvent(ActivityEvent event) {
        kieSession.insert(event);
        kieSession.fireAllRules();
        return kieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation)obj)
                .collect(Collectors.toList());
    }

    public List<Recommendation> getRecommendationsForSession(long sessionId) {
        return kieSession.getObjects(obj -> obj instanceof Recommendation)
                .stream()
                .map(obj -> (Recommendation)obj)
                .filter(rec -> rec.getSessionId() == sessionId)
                .collect(Collectors.toList());
    }



    public String endSession() {
        try {
            if (kieSession != null) {
                kieSession.dispose();
                kieSession = null;
                return "Successfully ended session";
            } else {
                return "No active session to end";
            }
        } catch(Exception e) {
            e.printStackTrace();
            return "Failed to end session...";
        }
    }


}
