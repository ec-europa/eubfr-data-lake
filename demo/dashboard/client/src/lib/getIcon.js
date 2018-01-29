// ERROR: 0
// UPLOADED: 1
// PROGRESS: 2
// PARSING: 3
// PARSED: 4
// NOT_PARSED: 5
// INGESTED: 6

export default status => {
  switch (status) {
    case 1:
    case 2:
    case 3:
    case 4:
      return 'ecl-icon ecl-icon--info ecl-u-color-info';
    case 5:
    case 7:
      return 'ecl-icon ecl-icon--success ecl-u-color-success';
    case 0:
    case 6:
    default:
      return 'ecl-icon ecl-icon--error ecl-u-color-error';
  }
};
