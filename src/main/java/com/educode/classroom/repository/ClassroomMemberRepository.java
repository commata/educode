package com.educode.classroom.repository;

import com.educode.classroom.domain.ClassroomMember;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ClassroomMemberRepository extends JpaRepository<ClassroomMember, Long> {
    boolean existsByClassroom_IdAndStudent_Id(Long classroomId, Long studentId);

    @EntityGraph(attributePaths = {"student"})
    List<ClassroomMember> findByClassroom_IdOrderByJoinedAtAsc(Long classroomId);

    @EntityGraph(attributePaths = {"classroom", "classroom.educator"})
    List<ClassroomMember> findByStudent_IdOrderByJoinedAtDesc(Long studentId);

    Optional<ClassroomMember> findByClassroom_IdAndStudent_Id(Long classroomId, Long studentId);

    List<ClassroomMember> findByClassroom_IdAndStudent_IdIn(Long classroomId, Collection<Long> studentIds);
}
