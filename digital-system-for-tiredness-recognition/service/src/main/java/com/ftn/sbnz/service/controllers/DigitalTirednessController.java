package com.ftn.sbnz.service.controllers;

import com.ftn.sbnz.model.dto.SessionDTO;
import com.ftn.sbnz.model.dto.TirednessReportDTO;
import com.ftn.sbnz.model.events.ActivityEvent;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import com.ftn.sbnz.service.services.TirednessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tiredness-system")
@CrossOrigin(origins = {"http://localhost:4200"})
public class DigitalTirednessController {

    private final TirednessService tirednessService;

    public DigitalTirednessController(TirednessService tirednessService) {
        this.tirednessService = tirednessService;
    }

    // sent init sessions in memory
    @PostMapping("/init-session")
    public void initSession(@RequestBody SessionDTO sessionDTO) {
        List<Session> allSessions = sessionDTO.getSessions();
        tirednessService.initSessions(allSessions);
    }

    // add new event in one session
    @PostMapping("/add-event")
    public List<Recommendation> processEvent(@RequestBody ActivityEvent event) {
        System.out.println(event.sessionId);
        return tirednessService.processEvent(event);
    }

    @GetMapping("/current-session/{sessionId}")
    public Session getSession(@PathVariable Long sessionId) {
        System.out.println("Fetching session with ID: " + sessionId);
        Session session = tirednessService.getSessionById(sessionId);
        System.out.println("Session fetched: " + session);
        return session;
    }

    @GetMapping("/session-recommendations/{sessionId}")
    public List<Recommendation> getRecommendations(@PathVariable long sessionId) {
        return tirednessService.getRecommendationsForSession(sessionId);
    }

    @GetMapping("/recommendations/user/{userId}")
    public List<Recommendation> getRecommendationsForUser(@PathVariable long userId) {
        return java.util.Collections.emptyList();
        // return tirednessService.getRecommendationsForSession(userId);
    }

    @PostMapping("/report-tiredness")
    public Recommendation reportTiredness(@RequestBody TirednessReportDTO report) {
        return tirednessService.backwardChaining(report);
    }


    // to do: save sessions by user in one json
    @PostMapping("/end-session")
    public String endSession(){
        return tirednessService.endSession();
    }

    @PostMapping("/submit-tiredness-level/{sessionId}")
    public ResponseEntity<Void> submitTirednessLevel(@PathVariable long sessionId, @RequestBody int level) {
        // TODO: implement logic
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activities/{sessionId}")
    public List<ActivityEvent> getActivitiesForSession(@PathVariable long sessionId) {
        // TODO: implement logic to return activities for session
        return java.util.Collections.emptyList();
    }
}
