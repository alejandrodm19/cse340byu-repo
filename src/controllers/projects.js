import {getAllProjects} from '../models/projects.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import {getCategoriesByProjectId} from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { createProject } from '../models/projects.js';
import {body, validationResult} from 'express-validator';
import { updateProject } from '../models/projects.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        
        const title = 'Upcoming Service Projects';
        
        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error loading upcoming projects:", error);
        res.status(500).send("Internal Server Error");
    }
};

const showProjectDetailsPage = async (req, res) => {
    try {
        // 1. Intentamos obtener el ID dinámico de la URL (Prueba tanto con projectId como con id)
        const projectId = req.params.projectId || req.params.id; 
        
        // 2. Buscamos los detalles del proyecto
        const projectDetails = await getProjectDetails(projectId);
        
        if (!projectDetails) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        // 3. Declaramos la variable al inicio del bloque para asegurar su existencia
        let categories = []; 
        
        try {
            // Intentamos llenar el array con la base de datos
            categories = await getCategoriesByProjectId(projectId);
        } catch (modelError) {
            console.error("⚠️ Error running getCategoriesByProjectId model function:", modelError);
            // Si la consulta SQL falló por algún motivo, dejamos el array vacío [] 
            // para que EJS NO se rompa y pinte "No categories assigned".
            categories = []; 
        }
        
        // 4. Aseguramos el envío explícito de todas las variables requeridas
        res.render('project', { 
            title: projectDetails.title, 
            projectDetails: projectDetails,
            categories: categories // Forzamos el puente de datos hacia EJS
        });

    } catch (error) {
        console.error("🔴 Fatal error in showProjectDetailsPage controller:", error);
        res.status(500).send("Internal Server Error");
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

/**
 * Displays the edit service project form pre-populated with data (GET)
 */
const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        const projectDetails = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!projectDetails) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        res.render('edit-project', {
            title: `Edit ${projectDetails.title}`,
            projectDetails,
            organizations
        });
    } catch (error) {
        console.error("Error loading edit project form:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Processes the submission of the edit service project form (POST)
 */
const processEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        const { organizationId, title, description, location, date } = req.body;

        await updateProject(projectId, organizationId, title, description, location, date);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error processing edit project form:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, projectValidation };