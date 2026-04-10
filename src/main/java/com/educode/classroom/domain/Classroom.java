package com.educode.classroom.domain;

import com.educode.common.domain.BaseTimeEntity;
import com.educode.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Table(name = "classrooms",
        indexes = {
                @Index(name = "idx_classrooms_educator_id", columnList = "educator_id"),
                @Index(name = "idx_classrooms_invite_code", columnList = "invite_code", unique = true)
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Classroom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "educator_id")
    private User educator;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "invite_code", nullable = false, unique = true, length = 6)
    private String inviteCode;

    public void updateInfo(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
