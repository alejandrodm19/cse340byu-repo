import {getAllProjects} from '../models/projects.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import {getCategoriesByProjectId} from '../models/categories.js';

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

export { showProjectsPage, showProjectDetailsPage };