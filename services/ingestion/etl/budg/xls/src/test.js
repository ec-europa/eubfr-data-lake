if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('projects.xls');
var sheet_name_list = workbook.SheetNames;

for (var i= 0; i < sheet_name_list.length; i++) {
  console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]));
}
