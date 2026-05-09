#! /usr/bin/env node

const { Client } = require("pg");
const { argv } = require('node:process');
// use arguments for connection string and ssl (optional)

const SQL = `
DROP TABLE IF EXISTS inventory;

DROP TABLE IF EXISTS category;

CREATE TABLE category (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   name VARCHAR ( 255 ),
   icon VARCHAR ( 1000 ),
   description VARCHAR ( 1000 )
);

CREATE TABLE inventory (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   name VARCHAR ( 255 ),
   description VARCHAR ( 1000 ),
   categoryid INT REFERENCES category(id),
   quantity INT CHECK (quantity >= 0)
);

INSERT INTO category (name, icon, description)
VALUES 
('Mobo', './mobo-icon.svg', 'Motherboards for different sockets, brands and more'),
('CPU', './cpu-icon.svg', 'Processors for the motherboard'),
('GPU', './gpu-icon.svg', 'Graphics cards for work and gaming'),
('RAM', './ram-icon.svg', 'DDR Memory for all types of motherboard'),
('Storage', './storage-icon.svg', 'HDD, SSD, NVME M.2 and more'),
('Case', './case-icon.svg', 'Desktop cases for all the PC components'),
('PSU', './psu-icon.svg', 'Power supply for all kinds of PC'),
('Cooling', './cooling-icon.svg', 'Heatsinks, fans, thermal paste and more');

INSERT INTO inventory (name, description, categoryid, quantity)
VALUES
-- Mobo (categoryid = 1)
(
  'ASUS ROG Strix B650E-F Gaming WiFi',
  'ATX motherboard for AMD AM5 processors with PCIe 5.0 and Wi-Fi 6E.',
  1,
  12
),
(
  'MSI MAG B760 Tomahawk WiFi',
  'ATX motherboard for Intel LGA1700 processors with DDR5 support.',
  1,
  8
),
(
  'Gigabyte X670 Aorus Elite AX',
  'High-performance AM5 motherboard with advanced connectivity.',
  1,
  5
),

-- CPU (categoryid = 2)
(
  'AMD Ryzen 7 7800X3D',
  '8-core gaming processor with 3D V-Cache for exceptional performance.',
  2,
  15
),
(
  'Intel Core i7-14700K',
  '20-core processor for gaming and productivity workloads.',
  2,
  10
),
(
  'AMD Ryzen 5 7600',
  '6-core processor with excellent price-to-performance ratio.',
  2,
  20
),

-- GPU (categoryid = 3)
(
  'NVIDIA GeForce RTX 4070 Super',
  'High-end graphics card for 1440p gaming and content creation.',
  3,
  7
),
(
  'AMD Radeon RX 7800 XT',
  'Powerful GPU designed for high-refresh-rate 1440p gaming.',
  3,
  6
),
(
  'NVIDIA GeForce RTX 4060',
  'Efficient mid-range graphics card with DLSS 3 support.',
  3,
  14
),

-- RAM (categoryid = 4)
(
  'Corsair Vengeance DDR5 32GB 6000MHz',
  '2x16GB DDR5 memory kit optimized for gaming and multitasking.',
  4,
  18
),
(
  'Kingston Fury Beast DDR4 16GB 3200MHz',
  'Reliable 2x8GB DDR4 memory kit for mainstream systems.',
  4,
  25
),
(
  'G.Skill Trident Z5 RGB 64GB 6400MHz',
  'Premium DDR5 memory kit with RGB lighting.',
  4,
  4
),

-- Storage (categoryid = 5)
(
  'Samsung 990 Pro 2TB NVMe SSD',
  'High-speed PCIe 4.0 NVMe SSD for demanding workloads.',
  5,
  9
),
(
  'WD Blue 1TB SATA SSD',
  'Affordable and dependable SATA solid-state drive.',
  5,
  22
),
(
  'Seagate Barracuda 4TB HDD',
  'Large-capacity hard drive for mass storage.',
  5,
  11
),

-- Case (categoryid = 6)
(
  'NZXT H7 Flow',
  'Mid-tower case with optimized airflow and cable management.',
  6,
  6
),
(
  'Corsair 4000D Airflow',
  'Popular ATX case with excellent cooling performance.',
  6,
  13
),
(
  'Lian Li O11 Dynamic EVO',
  'Premium dual-chamber case for showcase builds.',
  6,
  3
),

-- PSU (categoryid = 7)
(
  'Corsair RM850x',
  '850W 80 Plus Gold fully modular power supply.',
  7,
  10
),
(
  'Seasonic Focus GX-750',
  '750W 80 Plus Gold PSU with high efficiency.',
  7,
  12
),
(
  'EVGA SuperNOVA 1000 G6',
  '1000W fully modular power supply for enthusiast systems.',
  7,
  5
),

-- Cooling (categoryid = 8)
(
  'Noctua NH-D15',
  'Premium dual-tower air cooler with exceptional thermal performance.',
  8,
  8
),
(
  'Arctic Liquid Freezer III 360',
  '360mm all-in-one liquid cooler for high-end CPUs.',
  8,
  7
),
(
  'Thermal Grizzly Kryonaut',
  'High-performance thermal paste for improved heat transfer.',
  8,
  30
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `${argv[2]}`,
    ssl: argv[3] == 'ssl' ? true : false
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();