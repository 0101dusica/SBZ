package com.ftn.sbnz.model.dto;

import com.ftn.sbnz.model.models.Session;
import com.ftn.sbnz.model.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    List<Session> sessions;
}
