import * as volunteerModel from '../models/volunteer.js';

const handleAddVolunteer = async (req, res) => {
    const { project_id } = req.body;
    const user_id = req.session.user.user_id;

    try {
        await volunteerModel.addVolunteer(user_id, project_id);
        req.flash('success', 'Thank you for volunteering!');
        
        return res.redirect(`/project/${project_id}`); 
    } catch (error) {
        console.error("Error in handleAddVolunteer:", error);
        req.flash('error', 'Could not process volunteer registration.');
        return res.redirect('/projects');
    }
};

const handleRemoveVolunteer = async (req, res) => {
    const { project_id, redirect_to } = req.body;
    const user_id = req.session.user.user_id;

    try {
        await volunteerModel.removeVolunteer(user_id, project_id);
        req.flash('success', 'You have been removed as a volunteer.');
        
        return res.redirect(redirect_to || `/project/${project_id}`);
    } catch (error) {
        console.error("Error in handleRemoveVolunteer:", error);
        req.flash('error', 'Could not remove volunteer record.');
        return res.redirect('/dashboard');
    }
};

export { handleAddVolunteer, handleRemoveVolunteer };