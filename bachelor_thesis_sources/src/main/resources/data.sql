INSERT INTO location (id, classroom, building)
VALUES (1, 'D3-256', 'T2'),
       (2, 'D3-309', 'T2'),
       (3, 'B5-333', 'JP'),
       (4, 'E-301', 'KN'),
       (5, 'E-2', 'KN');
SELECT setval('location_id_seq', 5, true);

INSERT INTO email_template (id, email_type, subject, text)
VALUES (1, 'FINAL', 'testSubject FINAL', 'lorem ipsum FINAL'),
       (2, 'NOMINATED', 'testSubject NOMINATED', 'lorem ipsum NOMINATED'),
       (3, 'RECOMMENDED', 'testSubject RECOMMENDED', 'lorem ipsum RECOMMENDED');
SELECT setval('email_template_id_seq', 5, true);


INSERT INTO users (id, name, surname, email_address, login, password, first_login, role, active)
VALUES (1, 'admin', 'admin', 'admin@cvut.fel.cz', 'admin',
        '$2y$10$XEa9HvTAd7ITL3mE21aSXuVGKb7QBIbQwGWItGqQqM3ehTtwBF/NG', false, 'ROLE_MANAGER', true);
SELECT setval('users_id_seq', 1, true);


-- INSERT INTO teacher_property (id, contract)
-- VALUES (2, 1),
--        (1, 1);
-- SELECT setval('teacher_property_id_seq', 2, true);

INSERT INTO manager_property (id)
VALUES (1);
SELECT setval('manager_property_id_seq', 1, true);


-- UPDATE users
-- SET teacher = 2
-- WHERE id = 2;

-- UPDATE users
-- SET teacher = 1
-- WHERE id = 1;

UPDATE users
SET manager = 1
WHERE id = 1;

INSERT INTO exam (id, degree, location_id, semester)
VALUES (1, 'Bc', 2, 'Summer 2020/2021');
SELECT setval('exam_id_seq', 1, true);

INSERT INTO commission (id, exam_id, state)
VALUES (1, 1, 'DRAFT');
SELECT setval('commission_id_seq', 1, true);


-- ///////////////////////////////////////////////////////////////

INSERT INTO Field_Of_Study (id, field, deg)
VALUES (1, 'BP_EEM', 'Bc'),
       (2, 'BP_EK', 'Bc'),
       (3, 'BP_EEK', 'Bc'),
       (4, 'BP_KYR', 'Bc'),
       (5, 'BP_BIO', 'Bc'),
       (6, 'BP_OI', 'Bc'),
       (7, 'BP_OES', 'Bc'),
       (8, 'BP_SIT', 'Bc'),
       (9, 'MP_EEM', 'Ing'),
       (10, 'MP_EK', 'Ing'),
       (11, 'MP_KYR', 'Ing'),
       (12, 'MP_BIO', 'Ing'),
       (13, 'MP_OI', 'Ing'),
       (14, 'MP_OES', 'Ing'),
       (15, 'MP_IB', 'Ing'),
       (16, 'MP_LAK', 'Ing'),
       (17, 'D_KYR', 'PhD');
SELECT setval('field_of_study_id_seq', 17, true);


-- /////////////////////////////////
INSERT INTO position (id, position, description)
VALUES (1, 'M', 'Místopředseda'),
       (2, 'P', 'Předseda'),
       (3, 'C', 'Člen');
SELECT setval('position_id_seq', 3, true);
