import { getAllCategories } from '../models/categories.js';
import { getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };