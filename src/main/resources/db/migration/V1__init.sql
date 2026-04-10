CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE classrooms (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    educator_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    invite_code VARCHAR(6) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_classrooms_invite_code UNIQUE (invite_code),
    CONSTRAINT fk_classrooms_educator FOREIGN KEY (educator_id) REFERENCES users(id)
);

CREATE TABLE classroom_members (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    classroom_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    joined_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_classroom_members UNIQUE (classroom_id, student_id),
    CONSTRAINT fk_classroom_members_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    CONSTRAINT fk_classroom_members_student FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE problems (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    educator_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    time_limit INT NOT NULL,
    memory_limit INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_problems_educator FOREIGN KEY (educator_id) REFERENCES users(id)
);

CREATE TABLE test_cases (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    problem_id BIGINT NOT NULL,
    input_data TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BIT(1) NOT NULL,
    CONSTRAINT fk_test_cases_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

CREATE TABLE assignments (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    classroom_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    deadline DATETIME(6) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_assignments_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    CONSTRAINT fk_assignments_problem FOREIGN KEY (problem_id) REFERENCES problems(id)
);

CREATE TABLE submissions (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    assignment_id BIGINT NOT NULL,
    code LONGTEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    passed_cases INT NOT NULL DEFAULT 0,
    total_cases INT NOT NULL DEFAULT 0,
    error_message LONGTEXT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_submissions_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_classrooms_educator_id ON classrooms(educator_id);
CREATE INDEX idx_classroom_members_classroom_id ON classroom_members(classroom_id);
CREATE INDEX idx_classroom_members_student_id ON classroom_members(student_id);
CREATE INDEX idx_problems_educator_id ON problems(educator_id);
CREATE INDEX idx_test_cases_problem_id ON test_cases(problem_id);
CREATE INDEX idx_test_cases_problem_hidden ON test_cases(problem_id, is_hidden);
CREATE INDEX idx_assignments_classroom_id ON assignments(classroom_id);
CREATE INDEX idx_assignments_problem_id ON assignments(problem_id);
CREATE INDEX idx_assignments_deadline ON assignments(deadline);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_assignment_student_created_at ON submissions(assignment_id, student_id, created_at);
