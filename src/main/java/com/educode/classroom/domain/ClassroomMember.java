package com.educode.classroom.domain;

import com.educode.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "classroom_members",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_classroom_member", columnNames = {"classroom_id", "student_id"})
        },
        indexes = {
                @Index(name = "idx_classroom_members_classroom_id", columnList = "classroom_id"),
                @Index(name = "idx_classroom_members_student_id", columnList = "student_id")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ClassroomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;
}
