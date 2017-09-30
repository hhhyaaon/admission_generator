var fs = require("fs");
var path = require("path");
var xlsx = require("node-xlsx");
var trans = require("transliteration");


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
    if (sheet.name.indexOf("美国") > -1) res[sheetMap.america.id] = formatDataSource(sheet.data);
    if (sheet.name.indexOf("英国") > -1) res[sheetMap.uk.id] = formatDataSource(sheet.data);
    if (sheet.name.indexOf("其他") > -1) res[sheetMap.other.id] = formatDataSource(sheet.data);
})

//数据源
fs.writeFileSync(output, `
var fieldMap_adms=${JSON.stringify(map)};
var dataSource_adms=${JSON.stringify(res)};
`);


function formatDataSource(arr) {
    arr = arr.map(function (row, i) {
        if (i !== 0) {
            // 学生姓名：显示为[x]同学
            row[0] = (trans.transliterate(row[0]).substring(0, 1) || '') + '同学';
        }
        return row;
    });
    return {
        column: arr[0],
        list: arr.slice(1)
    }
}


function getRandom(count) {
    count = count || 8;
    var str = "";
    for (var i = 0; i < count; i++) {
        str += (Math.random() * 10).toString(36).charAt(parseInt(((Math.random() * 5) + 2).toString()));
    }
    return str;
};