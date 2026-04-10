package com.educode.classroom.service;

import com.educode.classroom.domain.Classroom;
import com.educode.classroom.dto.ClassroomDtos;
import com.educode.classroom.repository.ClassroomMemberRepository;
import com.educode.classroom.repository.ClassroomRepository;
import com.educode.common.exception.ApiException;
import com.educode.common.util.InviteCodeGenerator;
import com.educode.user.domain.User;
import com.educode.user.domain.UserRole;
import com.educode.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ClassroomServiceTest {

    @Mock ClassroomRepository classroomRepository;
    @Mock ClassroomMemberRepository classroomMemberRepository;
    @Mock UserService userService;
    @Mock InviteCodeGenerator inviteCodeGenerator;

    @InjectMocks ClassroomService classroomService;

    @Test
    void educator_canCreate() {
        User educator = User.builder().id(1L).email("e@test.com").password("x").name("선생님").role(UserRole.EDUCATOR).build();
        when(userService.getUser(1L)).thenReturn(educator);
        when(inviteCodeGenerator.generateUniqueCode()).thenReturn("ABC123");
        when(classroomRepository.save(any(Classroom.class))).thenAnswer(inv -> inv.getArgument(0));

        ClassroomDtos.ClassroomResponse response = classroomService.create(1L, UserRole.EDUCATOR,
                new ClassroomDtos.CreateClassroomRequest("자바반", "설명"));

        assertEquals("ABC123", response.inviteCode());
    }

    @Test
    void student_cannotCreate() {
        assertThrows(ApiException.class,
                () -> classroomService.create(1L, UserRole.STUDENT, new ClassroomDtos.CreateClassroomRequest("자바반", "설명")));
    }

    @Test
    void join_duplicate_throws() {
        Classroom classroom = Classroom.builder().id(1L).inviteCode("ABC123").name("반").educator(
                User.builder().id(9L).email("e@test.com").password("x").name("선생님").role(UserRole.EDUCATOR).build()
        ).build();
        when(classroomRepository.findByInviteCode("ABC123")).thenReturn(Optional.of(classroom));
        when(classroomMemberRepository.existsByClassroom_IdAndStudent_Id(1L, 2L)).thenReturn(true);

        assertThrows(ApiException.class,
                () -> classroomService.join(2L, UserRole.STUDENT, new ClassroomDtos.JoinClassroomRequest("ABC123")));
    }
}
