import {getAllProjects} from '../models/projects.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';

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
        const projectId = req.params.projectId; 
        
        const projectDetails = await getProjectDetails(projectId);
        
        if (!projectDetails) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }
        
        res.render('project', { 
            title: projectDetails.title, 
            projectDetails 
        });
    } catch (error) {
        console.error("Error loading project details:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { showProjectsPage, showProjectDetailsPage };