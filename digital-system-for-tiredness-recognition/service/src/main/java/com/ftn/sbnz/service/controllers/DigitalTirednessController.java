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
@CrossOrigin(origins = "*") // Za testiranje sa frontendom
public class DigitalTirednessController {

    private final TirednessService tirednessService;

    public DigitalTirednessController(TirednessService tirednessService) {
        this.tirednessService = tirednessService;
    }

    // Inicijalizacija sesija u memoriji
    @PostMapping("/add")
    public String addSessions(@RequestBody SessionDTO sessionDTO) {
        List<Session> allSessions = sessionDTO.getSessions();
        return tirednessService.addSessions(allSessions);
    }

    // Dodavanje novog događaja u sesiju
    @PostMapping("/event")
    public List<Recommendation> processEvent(@RequestBody ActivityEvent event) {
        return tirednessService.processEvent(event);
    }

    // Dobijanje preporuka za određenu sesiju
    @GetMapping("/recommendations/{sessionId}")
    public List<Recommendation> getRecommendations(@PathVariable long sessionId) {
        return tirednessService.getRecommendationsForSession(sessionId);
    }

    // Završavanje svih sesija
    @PostMapping("/end-session")
    public String endSession(){
        return tirednessService.endSession();
    }

    // Završavanje specifične sesije
    @PostMapping("/end-session/{sessionKey}")
    public String endSpecificSession(@PathVariable String sessionKey){
        return tirednessService.endSession(sessionKey);
    }

    // Status aktivnih sesija - korisno za testiranje
    @GetMapping("/status")
    public String getStatus() {
        int activeCount = tirednessService.getActiveSessionsCount();
        return "Active sessions: " + activeCount;
    }

    // Test endpoint - za brzu proveru da li aplikacija radi
    @GetMapping("/health")
    public String health() {
        return "Tiredness Recognition System is running!";
    }
}
