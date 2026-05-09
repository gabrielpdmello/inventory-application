const pool = require("./pool");

async function getCategories() {
  const result = await pool.query(`
    SELECT * FROM category
    ORDER BY name;
    `);
  const rows = result.rows;
  return rows;
}

async function getCategoryItems(id) {
  const result = await pool.query(`
    SELECT i.* FROM inventory i
    JOIN category c on (i.categoryid = c.id)
    WHERE c.id = $1`, [id]);
  const rows = result.rows;
  return rows;
}

async function getCategory(id) {
  const result = await pool.query(`
    SELECT * FROM category
    WHERE id = $1`, [id]);
  const rows = result.rows;
  return rows;
}

async function getItem(id) {
  const result = await pool.query(`
    SELECT * FROM inventory
    WHERE id = $1`, [id]);
  const rows = result.rows;
  const item = rows[0];
  return item;
}

async function getAllItems() {
  const result = await pool.query(`
    SELECT * FROM inventory
    ORDER BY categoryId;`);
  const rows = result.rows;
  return rows;
}

async function addItem(name, description, categoryId, quantity) {
  await pool.query(`
    INSERT INTO inventory (name, description, categoryId, quantity) 
    VALUES ($1, $2, $3, $4)`, [name, description, categoryId, quantity]);
}

async function getLastItem() {
  const result = await pool.query(`
    SELECT * FROM inventory
    ORDER BY id DESC
    LIMIT 1;
  `);
  const rows = result.rows;
  return rows;
}

async function addCategory(name, description) {
  await pool.query(`
    INSERT INTO category (name, description) 
    VALUES ($1, $2)`, [name, description]);
}

async function editItem(id, name, description, categoryId, quantity) {
  await pool.query(`
    UPDATE inventory 
    SET name = $2, description = $3, categoryId = $4, quantity = $5 
    WHERE id = $1`, [id, name, description, categoryId, quantity]);
}

async function editCategory(id, name, description) {
  await pool.query(`
    UPDATE category 
    SET name = $2, description = $3 
    WHERE id = $1`, [id, name, description]);
}

async function deleteItem(id) {
  await pool.query(`
    DELETE FROM inventory
    WHERE id = $1`, [id]);
}

async function deleteCategory(id) {
  await pool.query(`
    DELETE FROM inventory 
    WHERE categoryId = $1;`, [id]);
    
  await pool.query(`
    DELETE FROM category
    WHERE id = $1;`, [id]);
}

module.exports = {
  getCategories,
  getCategoryItems,
  getCategory,
  getItem,
  getAllItems,
  addItem,
  getLastItem,
  addCategory,
  editItem,
  editCategory,
  deleteItem,
  deleteCategory
}