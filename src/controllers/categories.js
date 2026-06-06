import { getAllCategories } from '../models/categories.js';
import { getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/categories.js';
import { body, validationResult } from 'express-validator';
import {createCategory} from '../models/categories.js';
import {updateCategory } from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    try {
        const title = 'Service Categories';
        const categories = await getAllCategories();
        
        res.render('categories', { title, categories });
    } catch (error) {
        console.error("Error loading categories page:", error);
        res.status(500).send("Internal Server Error");
    }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

/**
 * Handles the request to display the details page for a single category.
 */
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        const category = await getCategoryDetails(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);

        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        res.render('category', { 
            title: `${category.name} Projects`, 
            category, 
            projects 
        });
    } catch (error) {
        console.error("Error loading category details page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// SERVER-SIDE VALIDATION RULES: Present, max 100, min 3 characters
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

/**
 * Displays the form to create a new category (GET)
 */
const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

/**
 * Processes the submission of the new category form (POST)
 */
const processNewCategoryForm = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => req.flash('error', error.msg));
            return res.redirect('/new-category');
        }

        const { name } = req.body;
        await createCategory(name);

        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Displays the edit form for an existing category (GET)
 */
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        res.render('edit-category', { 
            title: `Edit Category: ${category.name}`, 
            category 
        });
    } catch (error) {
        console.error("Error loading edit category form:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Processes the submission of the edit category form (POST)
 */
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => req.flash('error', error.msg));
            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { name } = req.body;
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };