import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

export default status => {
  switch (status) {
    case STATUS.UPLOADED:
    case STATUS.PROGRESS:
    case STATUS.PARSING:
    case STATUS.PARSED:
      return 'ecl-icon ecl-icon--info ecl-u-color-info';
    case STATUS.INGESTED:
      return 'ecl-icon ecl-icon--success ecl-u-color-success';
    case STATUS.NOT_PARSED:
    case STATUS.ERROR:
    default:
      return 'ecl-icon ecl-icon--error ecl-u-color-error';
  }
};
