export default status => {
  switch (status) {
    case 'uploaded':
    case 'progress':
    case 'parsing':
    case 'parsed':
      return 'ecl-icon ecl-icon--success ecl-u-color-info';
    case 'ingested':
      return 'ecl-icon ecl-icon--success ecl-u-color-success';
    case 'not parsed':
      return 'ecl-icon ecl-icon--warning ecl-u-color-warning';
    default:
      return 'ecl-icon ecl-icon--error ecl-u-color-error';
  }
};
