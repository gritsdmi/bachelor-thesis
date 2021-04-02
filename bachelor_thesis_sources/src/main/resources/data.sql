INSERT INTO location (id, classroom, building)
VALUES
-- (teacher,'Lokesh', 'abc@gmail.com'),
-- (teacher,'Deja', 'xyz@email.com'),
(100, 'D3-256', 'T2'),
(101, 'D3-309', 'T2'),
(102, 'B5-333', 'JP'),
(103, 'E-301', 'KN'),
(104, 'E-2', 'KN');

INSERT INTO Field_Of_Study (id, field, deg)
VALUES (2, 'SIT', 'Bc');

INSERT INTO teacher (id, personal_number, name, surname, email_address, login, password, first_login)
VALUES (999, 1111111, 'Jiri', 'Sebek', 'sebek@sebek', 'sebek', 'sebek', true);

INSERT INTO email_template (id, email_type, subject, text)
VALUES (1, 'FINAL', 'testSubject', 'lorem ipsum');

INSERT INTO email_template (id, email_type, subject, text)
VALUES (2, 'NOMINATED', 'testSubject', 'lorem ipsum');

INSERT INTO email_template (id, email_type, subject, text)
VALUES (2, 'RECOMMENDED', 'testSubject', 'lorem ipsum');
