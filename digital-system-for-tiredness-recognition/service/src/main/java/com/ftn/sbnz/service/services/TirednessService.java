package com.ftn.sbnz.service.services;

import com.ftn.sbnz.model.events.ActivityEvent;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class TirednessService {

    private final KieContainer kieContainer;
    private final ConcurrentHashMap<String, KieSession> activeSessions;

    public TirednessService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
        this.activeSessions = new ConcurrentHashMap<>();
    }

    public String addSessions(List<Session> sessions) {
        try {
            KieSession kieSession = kieContainer.newKieSession("cepKSession");
            String sessionKey = "main_session_" + System.currentTimeMillis();

            for (Session session : sessions) {
                kieSession.insert(session);
                for (ActivityEvent event : session.getActivityEvents()) {
                    kieSession.insert(event);
                }
            }
            kieSession.fireAllRules();

            activeSessions.put(sessionKey, kieSession);
            return sessionKey;
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to add sessions: " + e.getMessage();
        }
    }

    public List<Recommendation> processEvent(ActivityEvent event) {
        try {
            // Za demonstraciju, koristimo poslednju aktivnu sesiju
            // U realnoj aplikaciji, trebalo bi da identifikujemo pravu sesiju
            KieSession kieSession = getActiveSession();
            if (kieSession == null) {
                return List.of();
            }

            kieSession.insert(event);
            kieSession.fireAllRules();

            return kieSession.getObjects(obj -> obj instanceof Recommendation)
                    .stream()
                    .map(obj -> (Recommendation) obj)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    public List<Recommendation> getRecommendationsForSession(long sessionId) {
        try {
            KieSession kieSession = getActiveSession();
            if (kieSession == null) {
                return List.of();
            }

            return kieSession.getObjects(obj -> obj instanceof Recommendation)
                    .stream()
                    .map(obj -> (Recommendation) obj)
                    .filter(rec -> rec.getSessionId() == sessionId)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    public String endSession() {
        try {
            if (!activeSessions.isEmpty()) {
                activeSessions.values().forEach(KieSession::dispose);
                activeSessions.clear();
                return "Successfully ended all sessions";
            } else {
                return "No active sessions to end";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to end sessions: " + e.getMessage();
        }
    }

    public String endSession(String sessionKey) {
        try {
            KieSession session = activeSessions.remove(sessionKey);
            if (session != null) {
                session.dispose();
                return "Successfully ended session: " + sessionKey;
            } else {
                return "Session not found: " + sessionKey;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to end session: " + e.getMessage();
        }
    }

    private KieSession getActiveSession() {
        return activeSessions.values().stream().findFirst().orElse(null);
    }

    public int getActiveSessionsCount() {
        return activeSessions.size();
    }
}