CREATE DATABASE IF NOT EXISTS jubilee_assembly;
USE jubilee_assembly;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_name VARCHAR(20) NOT NULL,
  service_time VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(30),
  description TEXT,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(150),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  keywords VARCHAR(255) NOT NULL DEFAULT '',
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (day_name, service_time, title, sort_order)
SELECT 'Sunday', '9:00 AM', 'Celebration service', 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE day_name = 'Sunday' AND service_time = '9:00 AM');
INSERT INTO services (day_name, service_time, title, sort_order)
SELECT 'Sunday', '11:30 AM', 'Celebration service', 2
WHERE NOT EXISTS (SELECT 1 FROM services WHERE day_name = 'Sunday' AND service_time = '11:30 AM');
INSERT INTO services (day_name, service_time, title, sort_order)
SELECT 'Wednesday', '6:30 PM', 'Midweek gathering', 3
WHERE NOT EXISTS (SELECT 1 FROM services WHERE day_name = 'Wednesday' AND service_time = '6:30 PM');

INSERT INTO events (title, event_date, event_time, description)
SELECT 'Welcome Home Sunday', '2026-09-14', '9:00 AM & 11:30 AM', 'A welcoming Sunday celebration.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Welcome Home Sunday');
INSERT INTO events (title, event_date, event_time, description)
SELECT 'Jubilee Night of Worship', '2026-09-21', '7:00 PM', 'An evening of worship.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Jubilee Night of Worship');
INSERT INTO events (title, event_date, event_time, description)
SELECT 'Serve the City', '2026-09-28', '10:00 AM', 'Serving our local community.'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Serve the City');

INSERT INTO chat_questions (question, keywords, answer)
SELECT 'What time are your services?', 'service time Sunday Wednesday', 'Our Sunday services are at 9:00 AM and 11:30 AM, with a midweek gathering on Wednesday at 6:30 PM.'
WHERE NOT EXISTS (SELECT 1 FROM chat_questions WHERE question = 'What time are your services?');
INSERT INTO chat_questions (question, keywords, answer)
SELECT 'What is available for kids?', 'kids children nursery', 'Jubilee Kids is available during both Sunday services for children from nursery through grade 5.'
WHERE NOT EXISTS (SELECT 1 FROM chat_questions WHERE question = 'What is available for kids?');
INSERT INTO chat_questions (question, keywords, answer)
SELECT 'Where do you meet?', 'where location address parking', 'We gather at 18 Jubilee Avenue, Riverside. There is free parking on site.'
WHERE NOT EXISTS (SELECT 1 FROM chat_questions WHERE question = 'Where do you meet?');
