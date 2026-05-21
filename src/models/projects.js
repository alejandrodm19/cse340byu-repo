import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT project_id, title, description, location, date, organization_id
      FROM public.service_project;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}  