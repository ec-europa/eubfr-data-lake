/*
 * Transform message
 */

/*
 * Map fields
 */
export default record => {
  // Map the fields
  return {
    programme_name: record['Project Title'],
  };
};
