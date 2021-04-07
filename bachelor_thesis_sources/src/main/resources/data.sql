INSERT INTO location (id, classroom, building)
VALUES (100, 'D3-256', 'T2'),
       (101, 'D3-309', 'T2'),
       (102, 'B5-333', 'JP'),
       (103, 'E-301', 'KN'),
       (104, 'E-2', 'KN');

-- INSERT INTO Field_Of_Study (id, field, deg)
-- VALUES (2, 'SIT', 'Bc');

-- INSERT INTO teacher (id, personal_number, name, surname, email_address, login, password, first_login)
-- VALUES (999, 1111111, 'Jiri', 'Sebek', 'sebek@sebek', 'sebek', 'sebek', true);

INSERT INTO email_template (id, email_type, subject, text)
VALUES (1, 'FINAL', 'testSubject', 'lorem ipsum');

INSERT INTO email_template (id, email_type, subject, text)
VALUES (2, 'NOMINATED', 'testSubject', 'lorem ipsum');

INSERT INTO email_template (id, email_type, subject, text)
VALUES (3, 'RECOMMENDED', 'testSubject', 'lorem ipsum');

-- //////////////////////// new mapping ////////////////////////
INSERT INTO users (id, name, surname)
VALUES (100000, 'name_test_1', 'surname_test_1');

INSERT INTO users (id, name, surname, email_address, login, password, first_login, role)
VALUES (999, 'jiri', 'sebek', 'sebek@sebek.cz', 'sebek', 'sebek', true, 'ROLE_TEST');

INSERT INTO teacher_property (id, contract)
VALUES (100000, 1),
       (999, 1);

UPDATE users
SET teacher = 100000
WHERE id = 100000;

INSERT INTO exam (id, degree, location_id)
VALUES (10000000, 'Bc', 101);

INSERT INTO commission (id, exam_id, state)
VALUES (10000000, 10000000, 'DRAFT');
-- ///////////////////////////////////////////////////////////////

INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1000, 'BP_EEM', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1001, 'BP_EK', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1002, 'BP_EEK', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1003, 'BP_KYR', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1004, 'BP_BIO', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1005, 'BP_OI', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1006, 'BP_OES', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1007, 'BP_SIT', 'Bc');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1101, 'MP_EEM', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1102, 'MP_EK', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1103, 'MP_KYR', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1104, 'MP_BIO', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1105, 'MP_OI', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1106, 'MP_OES', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1107, 'MP_IB', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1108, 'MP_LAK', 'Ing');
INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1200, 'D_KYR', 'PhD');

-- /////////////////////////////////
INSERT INTO position (id, position, description)
VALUES (1, 'M', 'Místopředseda');
INSERT INTO position (id, position, description)
VALUES (2, 'P', 'Předseda');
INSERT INTO position (id, position, description)
VALUES (3, 'C', 'Člen');
