package com.educode.classroom.repository;

import com.educode.classroom.domain.Classroom;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    boolean existsByInviteCode(String inviteCode);
    Optional<Classroom> findByInviteCode(String inviteCode);

    @EntityGraph(attributePaths = {"educator"})
    List<Classroom> findByEducator_IdOrderByCreatedAtDesc(Long educatorId);

    @EntityGraph(attributePaths = {"educator"})
    Optional<Classroom> findWithEducatorById(Long id);
}
