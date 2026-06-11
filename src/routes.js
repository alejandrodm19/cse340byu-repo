import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { 
    showEditOrganizationForm, 
    processEditOrganizationForm, 
    organizationValidation 
} from './controllers/organizations.js';
import { showNewProjectForm } from './controllers/projects.js';
import { processNewProjectForm } from './controllers/projects.js';
import { projectValidation } from './controllers/projects.js';
import {showAssignCategoriesForm, processAssignCategoriesForm} from './controllers/categories.js';
import {showEditProjectForm, processEditProjectForm} from './controllers/projects.js';
import { showNewCategoryForm, processNewCategoryForm } from './controllers/categories.js';
import { showEditCategoryForm, processEditCategoryForm } from './controllers/categories.js';
import {categoryValidation} from './controllers/categories.js';
import {showUserRegistrationForm, processUserRegistrationForm} from './controllers/users.js';
import {processLoginForm, showLoginForm} from './controllers/users.js';
import {processLogout} from './controllers/users.js';
import {requireLogin} from './controllers/users.js';
import {showDashboard} from './controllers/users.js';
import {checkAdmin} from './controllers/users.js';
import {requireRole} from './controllers/users.js';
import {showUsersManagementPage} from './controllers/users.js';







const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:projectId', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);
// error-handling routes
router.get('/test-error', testErrorPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.get('/edit-project/:id', showEditProjectForm);
router.get('/new-category', showNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.get('/register', showUserRegistrationForm);  
router.get('/login', showLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/new-category', requireLogin, checkAdmin, showNewCategoryForm);
router.post('/new-category', requireLogin, checkAdmin, processNewCategoryForm);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), processNewOrganizationForm);
router.post('/login', processLoginForm);
router.post('/register', processUserRegistrationForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);
router.post('/edit-project/:id', processEditProjectForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
export default router;