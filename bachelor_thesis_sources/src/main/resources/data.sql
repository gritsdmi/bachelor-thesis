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
VALUES (1, 'FINAL', 'testSubject FINAL', 'lorem ipsum FINAL'),
       (2, 'NOMINATED', 'testSubject NOMINATED', 'lorem ipsum NOMINATED'),
       (3, 'RECOMMENDED', 'testSubject RECOMMENDED', 'lorem ipsum RECOMMENDED');

-- //////////////////////// new mapping ////////////////////////
-- INSERT INTO users (id, name, surname)
-- VALUES (100000, 'name_test_1', 'surname_test_1');

INSERT INTO users (id, name, surname, email_address, login, password, first_login, role)
VALUES (999, 'jiri', 'sebek', 'sebek@sebek.cz', 'sebek', 'sebek', false, 'ROLE_TEST'),
       (100000, 'test_email', 'test_email', 'dimagr13@seznam.cz', 'email', 'email', false, 'ROLE_TEST');

INSERT INTO teacher_property (id, contract)
VALUES (100000, 1),
       (999, 1);

UPDATE users
SET teacher = 100000
WHERE id = 100000;

INSERT INTO exam (id, degree, location_id, semester)
VALUES (10000000, 'Bc', 101, 'Summer 2020/2021');

INSERT INTO commission (id, exam_id, state)
VALUES (10000000, 10000000, 'DRAFT');
-- ///////////////////////////////////////////////////////////////

INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1000, 'BP_EEM', 'Bc'),
       (1001, 'BP_EK', 'Bc'),
       (1002, 'BP_EEK', 'Bc'),
(1003, 'BP_KYR', 'Bc'),
(1004, 'BP_BIO', 'Bc'),
(1005, 'BP_OI', 'Bc'),
(1006, 'BP_OES', 'Bc'),
(1007, 'BP_SIT', 'Bc'),
(1101, 'MP_EEM', 'Ing'),
(1102, 'MP_EK', 'Ing'),
(1103, 'MP_KYR', 'Ing'),
(1104, 'MP_BIO', 'Ing'),
(1105, 'MP_OI', 'Ing'),
(1106, 'MP_OES', 'Ing'),
(1107, 'MP_IB', 'Ing'),
(1108, 'MP_LAK', 'Ing'),
(1200, 'D_KYR', 'PhD');

-- /////////////////////////////////
INSERT INTO position (id, position, description)
VALUES
(1, 'M', 'Místopředseda'),
(2, 'P', 'Předseda'),
(3, 'C', 'Člen');
