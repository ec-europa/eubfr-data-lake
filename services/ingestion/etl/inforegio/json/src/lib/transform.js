/*
 * Transform message
 */

/*
 * Map fields
 */
export default record => {
  console.log(record);

  // Map the fields
  return {
    project_id: record.sid,
    title: record.title,
  };
};
