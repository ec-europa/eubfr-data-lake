import parse from 'csv-parse';

const parser = parse({ columns: true, delimiter: ';' });

export default parser;
