/*
 * Transform message
 */

/*
 * Map fields
 */
export default record =>
  // Map the fields
  ({
    project_id: record.Nid,
    title: record.Name,
  });
