import * as volunteerModel from '../models/volunteer.js';

// POST: Add user as a volunteer
const handleAddVolunteer = async (req, res) => {
    const { project_id } = req.body;
    const user_id = req.session.user.user_id;

    try {
        await volunteerModel.addVolunteer(user_id, project_id);
        req.flash('success', 'Thank you for volunteering!');
        res.redirect(`/projects/detail/${project_id}`); // Redirect back to details page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Could not process volunteer registration.');
        res.redirect('/projects');
    }
};

// -- POST: Remove user as a volunteer
const handleRemoveVolunteer = async (req, res) => {
    const { project_id, redirect_to } = req.body;
    const user_id = req.session.user.user_id;

    try {
        await volunteerModel.removeVolunteer(user_id, project_id);
        req.flash('success', 'You have been removed as a volunteer.');
        
        // Redirect back to dashboard or project page depending on where they clicked it
        res.redirect(redirect_to || `/projects/detail/${project_id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Could not remove volunteer record.');
        res.redirect('/dashboard');
    }
};

export { handleAddVolunteer, handleRemoveVolunteer };