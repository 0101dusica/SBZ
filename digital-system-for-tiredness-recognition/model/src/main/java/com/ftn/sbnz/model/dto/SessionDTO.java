package com.ftn.sbnz.model.dto;

import com.ftn.sbnz.model.models.Session;

import java.util.List;
import java.util.ArrayList;

public class SessionDTO {

    private List<Session> sessions;

    public SessionDTO() {
        this.sessions = new ArrayList<>();
    }

    public SessionDTO(List<Session> sessions) {
        this.sessions = sessions;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public void addSession(Session session) {
        this.sessions.add(session);
    }
}
