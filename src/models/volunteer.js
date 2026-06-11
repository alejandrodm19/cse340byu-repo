import db from './db.js';

/**
 * Check if a specific user is already volunteering for a project
 */
const isUserVolunteering = async (user_id, project_id) => {
    const sql = 'SELECT 1 FROM public.project_volunteers WHERE user_id = $1 AND project_id = $2';
    const result = await db.query(sql, [user_id, project_id]);
    return result.rows.length > 0;
};

/**
 * Add a volunteer record
 */
const addVolunteer = async (user_id, project_id) => {
    const sql = 'INSERT INTO public.project_volunteers (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
    await db.query(sql, [user_id, project_id]);
};

/**
 * Remove a volunteer record
 */
const removeVolunteer = async (user_id, project_id) => {
    const sql = 'DELETE FROM public.project_volunteers WHERE user_id = $1 AND project_id = $2';
    await db.query(sql, [user_id, project_id]);
};

/**
 * Get all projects a specific user has volunteered for
 */
const getProjectsByVolunteer = async (user_id) => {
    const sql = `
        SELECT 
            p.project_id, 
            p.title AS project_name,       
            p.description AS project_description 
        FROM public.service_project p
        JOIN public.project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.title ASC;
    `;
    const result = await db.query(sql, [user_id]);
    return result.rows;
};

export { isUserVolunteering, addVolunteer, removeVolunteer, getProjectsByVolunteer };