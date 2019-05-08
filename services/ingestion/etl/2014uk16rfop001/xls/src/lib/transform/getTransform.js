import esf from './ESF/transform';
import esif from './ESIF/transform';

const getTransform = type => {
  let transform = null;

  switch (type) {
    case 'ESF':
      transform = esf;
      break;

    case 'ESIF':
      transform = esif;
      break;

    default:
      break;
  }

  return transform;
};

export default getTransform;
