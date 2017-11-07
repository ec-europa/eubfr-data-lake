const schema = `

type TimeFrame {
  from: String
  to: String
}

type Project {
  title: String!
  project_id: String
  eu_budget_contribution: String
  description: String
  timeframe: TimeFrame
}

type Query {
  getProjects : [Project]
}

`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
