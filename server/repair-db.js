import { pool } from './db.js'

const statements = [
  'DROP TABLE IF EXISTS chat_questions, contact_messages, events, services',
  `CREATE TABLE services (id INT AUTO_INCREMENT PRIMARY KEY, day_name VARCHAR(20) NOT NULL, service_time VARCHAR(20) NOT NULL, title VARCHAR(100) NOT NULL, sort_order INT NOT NULL DEFAULT 0)`,
  `CREATE TABLE events (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(150) NOT NULL, event_date DATE NOT NULL, event_time VARCHAR(30), description TEXT, image_url VARCHAR(255))`,
  `CREATE TABLE contact_messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL, subject VARCHAR(150), message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE chat_questions (id INT AUTO_INCREMENT PRIMARY KEY, question VARCHAR(255) NOT NULL, keywords VARCHAR(255) NOT NULL DEFAULT '', answer TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `INSERT INTO services (day_name, service_time, title, sort_order) VALUES ('Sunday', '9:00 AM', 'Celebration service', 1), ('Sunday', '11:30 AM', 'Celebration service', 2), ('Wednesday', '6:30 PM', 'Midweek gathering', 3)`,
  `INSERT INTO events (title, event_date, event_time, description) VALUES ('Welcome Home Sunday', '2026-09-14', '9:00 AM & 11:30 AM', 'A welcoming Sunday celebration.'), ('Jubilee Night of Worship', '2026-09-21', '7:00 PM', 'An evening of worship.'), ('Serve the City', '2026-09-28', '10:00 AM', 'Serving our local community.')`,
  `INSERT INTO chat_questions (question, keywords, answer) VALUES ('What time are your services?', 'service time Sunday Wednesday', 'Our Sunday services are at 9:00 AM and 11:30 AM, with a midweek gathering on Wednesday at 6:30 PM.'), ('What is available for kids?', 'kids children nursery', 'Jubilee Kids is available during both Sunday services for children from nursery through grade 5.'), ('Where do you meet?', 'where location address parking', 'We gather at 18 Jubilee Avenue, Riverside. There is free parking on site.')`,
]

for (const statement of statements) await pool.query(statement)
await pool.end()
console.log('Jubilee database repaired and seeded')