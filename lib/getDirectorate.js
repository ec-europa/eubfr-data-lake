// @flow

/**
 * Describes an EC directorate.
 * @type {Directorate}
 */
export type Directorate = {
  abbreviation: string,
  name: string,
  description: string,
};

// Source: https://www.docip.org/fileadmin/documents/Docip/Documents_permanents/DG_Commission_europenne_EN.pdf
const directorates: Array<Directorate> = [
  {
    abbreviation: 'ECFIN',
    name: 'Economic and Financial Affairs',
    description:
      'DG ECFIN aims at improving the economic wellbeing of EU citizens, through policies designed to promote sustainable economic growth, a high level of employment and financial stability.',
  },
  {
    abbreviation: 'MARE',
    name: 'Maritime Affairs and Fisheries',
    description:
      'DG MARE works to develop the potential of the European maritime economy and to secure a safe and stable supply of seafood, sustainable fisheries, the preservation of the marine environment and prosperous coastal communities.',
  },
  {
    abbreviation: 'AGRI',
    name: 'Agriculture and rural development',
    description:
      'The mission of the DG AGRI is to promote the sustainable development of European agriculture.',
  },
  {
    abbreviation: 'JRC',
    name: 'Joint Research Centre',
    description:
      "As the Commission's in-house science service, the DG JRC's mission is to provide EU policies with independent and technical support.",
  },
  {
    abbreviation: 'COMM',
    name: 'Communication',
    description:
      'DG Communication is in charge of informing and communicating about EU policies with the public at large as well as informing the Commission on trends in public opinion.',
  },
  {
    abbreviation: 'COMP',
    name: 'Competition',
    description:
      'DG COMP, together with the national competition authorities, directly enforces EU competition rules.',
  },
  {
    abbreviation: 'EAC',
    name: 'Education and Culture',
    description:
      'DG EAC is responsible for policy on education, culture, youth, languages and sport.',
  },
  {
    abbreviation: 'EMPL',
    name: 'Employment, Social Affairs and Inclusion',
    description:
      'DG EMPL coordinates and monitors national policies and it promotes the sharing of best practices in fields like employment, poverty and social exclusion and pensions.',
  },
  {
    abbreviation: 'ENER',
    name: 'Energy',
    description:
      'DG ENER focuses on developing and implementing EU energy policy',
  },
  {
    abbreviation: 'ESTAT',
    name: 'Eurostat',
    description:
      'DG ESTAT’s task is to provide the EU with statistics at European level that enable comparisons between countries and regions.',
  },
  {
    abbreviation: 'TAXUD',
    name: 'Taxation and Customs Union',
    description: 'DG TAXUD aims at managing the customs union.',
  },
  {
    abbreviation: 'DIGIT',
    name: 'Informatics',
    description:
      'DG DIGIT enables an efficient usage of the communication and information technologies to achieve its objectives.',
  },
  {
    abbreviation: 'SCIC',
    name: 'Interpretation',
    description:
      'DG SCIC is the European Commission’s interpreting service and conference organiser.',
  },
  {
    abbreviation: 'JUST',
    name: 'Justice',
    description:
      'DG SCIC is the European Commission’s interpreting service and conference organiser.',
  },
  {
    abbreviation: 'MOVE',
    name: 'Mobility and Transport',
    description:
      'The aim of DG MOVE is to promote a mobility that is efficient and environmentally friendly.',
  },
  {
    abbreviation: 'REGIO',
    name: 'Regional and Urban Policy',
    description:
      'DG REGIO aims to support job creation, business competitiveness, economic growth, sustainable development, and improve citizens’ quality of life in all regions and cities in the EU.',
  },
  {
    abbreviation: 'RTD',
    name: 'Research and Innovation',
    description:
      'DG RTD defines and implements European Research and Innovation (R&I) policy by analysing national policies and by formulating country specific recommendations.',
  },
  {
    abbreviation: 'CNECT',
    name: 'Communications Networks, Content and Technology',
    description:
      'DG CNECT seeks to foster innovation, creativity, culture, excellence in research and competitive markets.',
  },
  {
    abbreviation: 'HR',
    name: 'Human Resources and Security',
    description:
      'DG HR is dedicated to making the civil service of the EU a modern, effective and dynamic organisation.',
  },
  {
    abbreviation: 'HR',
    name: 'Human Resources and Security',
    description:
      'DG HR is dedicated to making the civil service of the EU a modern, effective and dynamic organisation.',
  },
  {
    abbreviation: 'SANTE',
    name: 'Health and Food Safety',
    description:
      'DG SANTE aims at protecting and improving public health. It also covers issues related to the welfare of farm animals, crops and forests.',
  },
  {
    abbreviation: 'SG',
    name: 'Secretariat-General',
    description:
      'DG SG ensures the overall coherence of the Commission’s work – both in shaping new policies and in steering them through the other EU institutions.',
  },
  {
    abbreviation: 'FISMA',
    name: 'Financial Stability, Financial Services and Capital Markets Union',
    description:
      'DG FISMA is responsible for initiating and implementing EU policies in the area of banking and finance.',
  },
  {
    abbreviation: 'DGT',
    name: 'Translation',
    description:
      "DG DGT translates texts for the European Commission into and out of the EU's 24 languages.",
  },
  {
    abbreviation: 'ECHO',
    name: 'Humanitarian Aid and Civil Protection',
    description:
      'DG ECHO aims at saving and preserving life, at preventing and alleviating human suffering and safeguard the integrity and dignity of populations affected by natural disasters and man-made crises.',
  },
  {
    abbreviation: 'DEVCO',
    name: 'International Cooperation and Development',
    description:
      'DG DEVCO is responsible for designing European international cooperation and development policy as well as thematic policies in order to reduce poverty in the world, to ensure sustainable economic, social and environmental development and to promote democracy, the rule of law, good governance and the respect of human rights.',
  },
  {
    abbreviation: 'FPI',
    name: 'Service for Foreign Policy Instruments',
    description:
      'DG FPI is a service of the European Commission which works alongside the European External Action Service (EEAS) running EU foreign policy actions.',
  },
  {
    abbreviation: 'FPI',
    name: 'Service for Foreign Policy Instruments',
    description:
      'DG FPI is a service of the European Commission which works alongside the European External Action Service (EEAS) running EU foreign policy actions.',
  },
  {
    abbreviation: 'CLIMA',
    name: 'Climate Action',
    description:
      'DG CLIMA fights against climate change at European and international level.',
  },
  {
    abbreviation: 'BUDG',
    name: 'Budget',
    description:
      'DG BUDG manages budgets for carrying out EU policies, promotes the good management of Community funds and reports on the use of loans.',
  },
  {
    abbreviation: 'TRADE',
    name: 'Trade',
    description:
      "DG TRADE focuses on developing and implementing the EU's trade and investment policy. With a large competence area (manufactured goods, services, intellectual property and investment), DG TRADE coordinates commercial relations between the European Union and the rest of the world.",
  },
  {
    abbreviation: 'ENV',
    name: 'Environment',
    description:
      'DG ENV aims to protect, preserve and improve the environment, proposing and implementing policies that ensure a high level of environmental protection in the European Union.',
  },
  {
    abbreviation: 'GROW',
    name: 'Internal Market, Industry, Entrepreneurship and SMEs',
    description:
      'DG GROW is responsible for completing the internal market for goods and services; fostering entrepreneurship and growth; supporting access to global markets for EU companies; generating policy on the protection and enforcement of industrial property rights; coordinating the EU position and negotiations in the international intellectual property rights system.',
  },
  {
    abbreviation: 'HOME',
    name: 'Migration and Home Affairs',
    description:
      'DG HOME focuses on building a common EU migration and asylum policy; ensuring EU security; and managing the external dimension and funding of the EU home affairs policy.',
  },
  {
    abbreviation: 'NEAR',
    name: 'Neighbourhood Policy and Enlargement Negotiations',
    description:
      "The mission of the DG NEAR is to take forward the EU's neighbourhood and enlargement policies, as well as coordinating relations with EEA-EFTA countries and working closely with the EEAS and the line DGs in charge of thematic priorities.",
  },
];

const getDirectorate = (
  directorateAbbreviation: string
): Directorate | null => {
  let match = null;
  directorates.forEach(directorate => {
    const { abbreviation } = directorate;
    match = abbreviation === directorateAbbreviation ? directorate : null;
  });
  return match;
};

export default getDirectorate;
