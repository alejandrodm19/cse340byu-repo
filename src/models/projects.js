import db from './db.js'



const getAllProjects = async() => {
    const query = `
        SELECT project_id, title, description, location, date, organization_id
      FROM public.service_project;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async () => {
  const query = `
    SELECT project_id, title, description, location, date, organization_id
    FROM public.service_project
    WHERE date >= CURRENT_DATE
    ORDER BY date ASC
    LIMIT $1;
  `;
  const result = await db.query(query, [5]);
  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT project_id, title, description, location, date, organization_id
    FROM public.service_project
    WHERE project_id = $1;
  `;
  const queryParams = [projectId];
  const result = await db.query(query, queryParams);
  return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO public.service_project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, organizationId, title, description, location, date) => {
    const query = `
        UPDATE public.service_project
        SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [organizationId, title, description, location, date, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Service project not found');
    }

    return result.rows[0].project_id;
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject };
