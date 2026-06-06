import { getAllOrganizations, getOrganizationDetails, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { createOrganization } from '../models/organization.js'; // Recuerda verificar si este archivo también debería llevar "s" o no para hacer match
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

/**
 * Displays the main list of all partner organizations (GET)
 */
const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error("Error loading organizations page:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Displays details for a single organization, including its projects (GET)
 */
const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = 'Organization Details';

        if (!organizationDetails) {
            return res.status(404).render('errors/404', { title: 'Organization Not Found' });
        }

        res.render('organization', { title, organizationDetails, projects });
    } catch (error) {
        console.error("Error loading organization details page:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Displays the form to create a new organization (GET)
 */
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

/**
 * Displays the edit form for an existing organization pre-populated with data (GET)
 */
const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', { title: 'Organization Not Found' });
        }

        const title = 'Edit Organization';
        res.render('edit-organization', { title, organizationDetails });
    } catch (error) {
        console.error("Error loading edit organization form:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Processes the submission of the new organization form (POST)
 */
const processNewOrganizationForm = async (req, res) => {
    try {
        // Check for express-validator errors
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/new-organization');
        }

        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';   

        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        req.flash('success', 'Organization added successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error("Error processing new organization form:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Processes the submission of the edit/update organization form (POST)
 */
const processEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        
        // Revisa también los errores de validación para la edición
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect(`/edit-organization/${organizationId}`);
        }

        // Extraído usando camelCase para coincidir con tu vista edit-organization.ejs
        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error("Error processing edit organization form:", error);
        res.status(500).send("Internal Server Error");
    }
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect('/edit-organization/' + req.params.id);
    }
};

export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    showEditOrganizationForm, 
    processNewOrganizationForm, 
    processEditOrganizationForm, 
    organizationValidation 
};