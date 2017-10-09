if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('projects.xls');
var sheet_name_list = workbook.SheetNames;

console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
