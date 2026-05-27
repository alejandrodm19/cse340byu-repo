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

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };
