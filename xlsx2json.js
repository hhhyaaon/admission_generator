var fs = require("fs");
var path = require("path");
var xlsx = require("node-xlsx");


var input = path.join(__dirname, "./file.xlsx");
var output = path.join(__dirname, "./js/json.js");
var sheets = xlsx.parse(fs.readFileSync(input));

var map = {
    sheetMap: {
        america: {
            id: "usa",//getRandom(),
            text: "美国",
            img: "header_mei.jpg",
            title: "微思教育-美国录取榜",
            kw: "微思教育，微思教育录取榜",
            desc: "微思教育美国录取榜"
        },
        uk: {
            id: "uk",//getRandom(),
            text: "英国",
            img: "header_ying.jpg",
            title: "微思教育-英国录取榜",
            kw: "微思教育，微思教育录取榜",
            desc: "微思教育英国录取榜"
        },
        other: {
            id: "other",//getRandom(),
            text: "其他国家",
            img: "header_other.jpg",
            title: "微思教育-其他国家录取榜",
            kw: "微思教育，微思教育录取榜",
            desc: "微思教育其他国家录取榜"
        }
    }
}


var res = {};

sheets.map(function (sheet) {
    var sheetMap = map.sheetMap;
    if (sheet.name.indexOf("美国") > -1) res[sheetMap.america.id] = sheet.data;
    if (sheet.name.indexOf("英国") > -1) res[sheetMap.uk.id] = sheet.data;
    if (sheet.name.indexOf("其他") > -1) res[sheetMap.other.id] = sheet.data;
})

//数据源
fs.writeFileSync(output, `
var fieldMap_adms=${JSON.stringify(map)};
var dataSource_adms=${JSON.stringify(res)};
`);


// sheets.map(function (sheet) {
//     var colums = sheet.data.shift;
//     var data = [];
//     //loop colums, get field name of row data
//     colums.map(function (colum, idx) {
//         var name = getRandom();
//         //loop row, get row data
//         sheet.map(function (row, i) {
//             var row_obj = data[i] || {};
//         })
//     })

//     return {
//         name: sheet.name,
//         colums: colums,
//         data: data
//     }
// });


function getRandom(count) {
    count = count || 8;
    var str = "";
    for (var i = 0; i < count; i++) {
        str += (Math.random() * 10).toString(36).charAt(parseInt(((Math.random() * 5) + 2).toString()));
    }
    return str;
};