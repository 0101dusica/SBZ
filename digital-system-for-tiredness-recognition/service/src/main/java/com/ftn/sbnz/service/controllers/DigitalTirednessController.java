package com.ftn.sbnz.service.controllers;

import com.ftn.sbnz.model.dto.SessionDTO;
import com.ftn.sbnz.model.events.ActivityEvent;
import com.ftn.sbnz.model.models.Recommendation;
import com.ftn.sbnz.model.models.Session;
import com.ftn.sbnz.service.services.TirednessService;
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
        tirednessService.addSessions(allSessions);
    }

    // add new event in one session
    @PostMapping("/add-event")
    public List<Recommendation> processEvent(@RequestBody ActivityEvent event) {
        return tirednessService.processEvent(event);
    }

    @GetMapping("/current-session/{sessionId}")
    public SessionDTO getSession(@PathVariable long sessionId) {
        return null;
//        return tirednessService.getRecommendationsForSession(sessionId);
    }

    @GetMapping("/recommendations/{sessionId}")
    public List<Recommendation> getRecommendations(@PathVariable long sessionId) {
        return tirednessService.getRecommendationsForSession(sessionId);
    }

    @GetMapping("/recommendations/{userId}")
    public List<Recommendation> getRecommendationsForUser(@PathVariable long userId) {
        return null;
//        return tirednessService.getRecommendationsForSession(userId);
    }

    // to do: save sessions by user in one json
    @PostMapping("/end-session")
    public String endSession(){
        return tirednessService.endSession();
    }
}
