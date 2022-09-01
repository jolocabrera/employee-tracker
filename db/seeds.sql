INSERT INTO department (name)
VALUES 
('Product Development'),
('Finance'),
('Sales & Marketing'),
('Logistics');

INSERT INTO role (title, salary, department_id)
VALUES
('Front End Developer', 60000, 1),
('Back End Developer', 70000, 1),
('Accountant', 10000, 2), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Director', 90000, 3),
('Logistics Assistant Manager', 80000, 4),
('Logistics Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Jacob', 2, null),
('Mel', 'Byers', 1, 1),
('Jason', 'Williams', 4, null),
('Ashley', 'Tisdale', 3, 3),
('Bill', 'Gates', 6, null),
('Lisa', 'Henderson', 5, 5),
('Seth', 'Rogan', 7, null),
('Caitlin', 'Brown', 8, 7);
