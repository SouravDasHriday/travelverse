CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO destinations (name, country, description, price)
SELECT 'Kyoto', 'Japan', 'Historic temples, bamboo forests, and traditional tea houses.', 1450
WHERE NOT EXISTS (SELECT 1 FROM destinations);

INSERT INTO destinations (name, country, description, price)
SELECT 'Santorini', 'Greece', 'Whitewashed cliffside villages overlooking the Aegean Sea.', 1800
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Santorini');

INSERT INTO destinations (name, country, description, price)
SELECT 'Banff', 'Canada', 'Turquoise glacial lakes and rugged Rocky Mountain peaks.', 1300
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Banff');
