const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const validatePassword = [
    body('password').trim()
        .custom(value => {
            const match = value === process.env.ADMIN_PSW;
            if (!match) {
                throw new Error("Incorrect password.")
            }
            return true
        })
]

const validateCategory = [
    body('name').trim()
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters.'),
    body('description').trim()
        .isLength({ min: 1, max: 260 }).withMessage('Description must be between 1 and 260 characters.')
]

const validateItem = [
    body('name').trim()
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters.'),
    body('description').trim()
        .isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters.'),
    body('category')
        .notEmpty().withMessage('Please select a category.'),
    body('quantity')
        .notEmpty().withMessage('Please insert a quantity.')
        .isInt({ min: 0}).withMessage('Quantity must be 0 or more.')
]

function errorHandler(err, req, res, next) {
    res.status(500)
    res.render('error', { error: err, repoUrl: process.env.REPO_URL })

}

async function getCategories(req, res, next) {
    try {
        const rows = await db.getCategories();
        res.render("index", { categories: rows })
    } catch (error) {
        next(error);
    }
}

async function getCategoryItems(req, res, next) {
    const id = req.params.categoryId;
    try {
        const itemRows = await db.getCategoryItems(id);
        const categoryRows = await db.getCategory(id);
        res.render("category", { category: categoryRows[0], items: itemRows })
    } catch (error) {
        next(error);
    }
}

async function getItem(req, res, next) {
    const id = req.params.itemId;
    try {
        const row = await db.getItem(id);
        res.render("item", { item: row })
    } catch (error) {
        next(error);
    }
}

async function getAllItems(req, res, next) {
    try {
        const rows = await db.getAllItems();
        res.render("all", { items: rows })
    } catch (error) {
        next(error);
    }
}

async function getAddItem(req, res, next) {
    try {
        const rows = await db.getCategories();
        res.render("additem", { categories: rows });
    } catch (error) {
        next(error);
    }
}

const postAddItem = [
    validateItem,
    async (req, res, next) => {
        const name = req.body.name;
        const description = req.body.description;
        const categoryId = req.body.category;
        const quantity = req.body.quantity;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const rows = await db.getCategories();
            return res.status(400).render("additem", {
                errors: errors.array(),
                categories: rows
            });
        }
        try {
            await db.addItem(name, description, categoryId, quantity);
            const addedItem = await db.getLastItem();
            const itemId = addedItem[0].id;
            res.redirect(`/item/${itemId}`);
        } catch (error) {
            next(error);
        }
    }
]

async function getAddCategory(req, res) {
    res.render("addcategory");
}

const postAddCategory = [
    validateCategory,
    async (req, res, next) => {
        const name = req.body.name;
        const description = req.body.description;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("addcategory", {
                errors: errors.array()
            });
        }
        try {
            await db.addCategory(name, description);
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    }
]

async function getEditItem(req, res, next) {
    const id = req.params.itemId;
    try {
        const itemRows = await db.getItem(id);
        const categoryId = itemRows.id;
        const categoryRows = await db.getCategories(categoryId);
        res.render("edititem", { item: itemRows, categories: categoryRows })
    } catch (error) {
        next(error);
    }
}

const postEditItem = [
    validatePassword,
    validateItem,
    async (req, res, next) => {
        const name = req.body.name;
        const description = req.body.description;
        const categoryId = req.body.category;
        const quantity = req.body.quantity;
        const itemId = req.params.itemId;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const itemRows = await db.getItem(itemId);
            const categoryId = itemRows.id;
            const categoryRows = await db.getCategories(categoryId);
            return res.status(400).render("edititem", {
                errors: errors.array(),
                item: itemRows,
                categories: categoryRows
            });
        }
        try {
            await db.editItem(itemId, name, description, categoryId, quantity);
            res.redirect(`/item/${itemId}`);
        } catch (error) {
            next(error);
        }
    }
]

async function getEditCategory(req, res, next) {
    const id = req.params.categoryId;
    try {
        const row = await db.getCategory(id);
        res.render("editcategory", { category: row[0] })
    } catch (error) {
        next(error);
    }
}

const postEditCategory = [
    validatePassword,
    validateCategory,
    async (req, res, next) => {
        const name = req.body.name;
        const description = req.body.description;
        const categoryId = req.params.categoryId;
        const row = await db.getCategory(categoryId);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("editcategory", {
                errors: errors.array(),
                category: row[0]
            });
        }
        try {
            await db.editCategory(categoryId, name, description);
            res.redirect(`/category/${categoryId}`);
        } catch (error) {
            next(error);
        }
    }
]

const postDeleteItem = [
    validatePassword,
    async (req, res, next) => {
        const id = req.params.itemId;
        const row = await db.getItem(id);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categoryId = row.id;
            const categoryRows = await db.getCategories(categoryId);
            return res.status(400).render("edititem", {
                errors: errors.array(),
                item: row,
                categories: categoryRows
            });
        }
        try {
            await db.deleteItem(id);
            res.redirect(`/category/${row.categoryid}`);
        } catch (error) {
            next(error);
        }
    }
]

const postDeleteCategory = [
    validatePassword,
    async (req, res, next) => {
        const id = req.params.categoryId;
        const row = await db.getCategory(id);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("editcategory", {
                errors: errors.array(),
                category: row[0]
            });
        }
        try {
            await db.deleteCategory(id);
            res.redirect(`/`);
        } catch (error) {
            next(error);
        }
    }
]

module.exports = {
    errorHandler,
    getCategories,
    getCategoryItems,
    getItem,
    getAllItems,
    getAddItem,
    postAddItem,
    getAddCategory,
    postAddCategory,
    getEditItem,
    postEditItem,
    getEditCategory,
    postEditCategory,
    postDeleteItem,
    postDeleteCategory
}