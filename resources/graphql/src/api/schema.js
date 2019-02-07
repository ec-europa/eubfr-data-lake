const schema = `

type Query {
    ping(): String
}

schema {
    query: Query
}`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
