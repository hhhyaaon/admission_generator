
//search
(function ($) {
    window.hy = window.hy || {};

    window.hy.searchBar = function (cfg) {
        var _cfg = Object.assign({}, {
            element: $("<div>"),
            field_name: [],
            field_value: "",
            onSearch: function () { }
        }, cfg);

        var _this = new searchBar();

        init();

        function init() {
            createDom();
        }

        function createDom() {
            var $ddl_panel = $("<ul>")
                .addClass("sb-ddl-pan");
            _cfg.field_name.map(function (name) {
                $ddl_panel
                    .append($("<li>")
                        .text(name.text)
                        .attr("ddl_id", name.value)
                        .click(function () {
                            onSelectOption.call(this, name)
                        })
                    );
            })

            var $ddl = $("<div>")
                .append($("<span>")
                    .addClass("sb-ddl-text")
                )
                .append($("<div>")
                    .click(onClickeDdl)
                    .addClass("sb-ddl-btn")
                )
                .append($ddl_panel)
                .addClass("sb-ddl");

            var $search = $("<div>")
                .append($("<input>")
                    .addClass("sb-search-input")
                )
                .append($("<button>")
                    .text("搜索")
                    .addClass("sb-search-btn")
                    .click(onSearch)
                )
                .addClass("sb-search")

            _cfg.element.append(
                $("<div>")
                    .append($ddl)
                    .append($search)
                    .addClass("sb-wrap")
            );
        }

        function onSearch() {
            if (typeof _cfg.onSearch === "function") {
                var kw = _cfg.element.find(".sb-search-input").val();
                var cdt = _cfg.element.find(".sb-ddl").attr("value");
                _cfg.onSearch.call(_this, kw.trim(), cdt);
            }
        }


        function onClickeDdl() {
            var $pan = _cfg.element.find(".sb-ddl-pan");
            $pan.hasClass("show") ? _hidePan() : _showPan();

        }

        function onSelectOption(obj) {
            _cfg.element.find(".sb-ddl-text").text(obj.text);
            _cfg.element.find(".sb-ddl").attr("value", obj.value);
            _hidePan();
        }

        function _showPan() {
            var $pan = _cfg.element.find(".sb-ddl-pan");
            $pan.addClass("show");
        }

        function _hidePan() {
            var $pan = _cfg.element.find(".sb-ddl-pan");
            $pan.removeClass("show");
        }


        function searchBar() {
            if (this instanceof searchBar === false) return;
            this.element = _cfg.element;
            return this;
        }
        return _this;
    }
}(Zepto));




(function ($, data, map) {

    if (!data) alert("获取录取榜失败");

    var $menu = $(".adms-menu");
    var $header = $(".adms-header");
    var $title = $(".adms-title");
    var $search = $(".adms-search");
    var $thead = $(".adms-table>table>thead");
    var $tbody = $(".adms-table>table>tbody");

    // url query name
    var sstName = "country";
    var sheetMap = map.sheetMap;
    var curSheetId = _getQuery()[sstName] || sheetMap.america.id;

    // 数据源排序
    var colRankIdx = 10;

    // 搜索栏
    var searchBar = null;
    var search_colum = [
        { id: "4", text: "毕业院校" },
        { id: "5", text: "本科专业" },
        { id: "6", text: "录取院校" },
        { id: "9", text: "录取专业" }
    ];

    init()

    function init() {
        initSearch();
        createDom(curSheetId);
    }

    function getDataSourceByOrder(dataSource) {
        // 数据源按照以下方式排序：
        // 1、按年份倒序排列（按excel划分）
        // 2、同年份按【综合排名】正序排列
        return dataSource.sort(function (a, b) {
            return Number(a[colRankIdx]) >= Number(b[colRankIdx]) ? 1 : -1;
        });
    }

    function initSearch() {
        searchBar = new hy.searchBar({
            field_name: search_colum.map(function (o) {
                return {
                    value: o.id,
                    text: o.text
                }
            }),
            onSearch: onSearch
        });
        $search.empty().append(searchBar.element);
    }


    function createDom(curSheetId) {
        var curSheetData = data[curSheetId];
        var dataSource = getDataSourceByOrder(curSheetData.list);
        createMenu();
        createTable(curSheetData.column, dataSource);
        setPageDate(curSheetId);
    }


    function setPageDate(curSheetId) {
        var obj = null;
        Object.getOwnPropertyNames(map.sheetMap).map(function (name) {
            if (map.sheetMap[name].id === curSheetId) obj = map.sheetMap[name];
        })
        $header.attr("src", `img/${obj.img}`);
        $title.text(`微思教育 ${obj.text}录取榜`);
        $("head")
            .append($("<title>").text(obj.title))
            .append($("<meta name='Keywords'>").attr("content", obj.kw))
            .append($("<meta name='Description'>").attr("content", obj.desc))
    }

    function createMenu() {
        $menu.empty();
        //menu
        Object.getOwnPropertyNames(sheetMap).map(function (name) {
            //if (sheetMap[name].id != sheet_id) {
            $menu.append(
                $("<div>")
                    .text(`点击 获取${sheetMap[name].text}录取榜`)
                    .addClass("adms-menu-block adms-menu-col")
                    .width(`${parseFloat(100 / (Object.getOwnPropertyNames(sheetMap).length))}%`)
                    .click(function () {
                        onClickMenuItem.call(this, sheetMap[name].id)
                    })
            )
            //}
        })
        function onClickMenuItem(curSheetId) {
            var query = {};
            query[sstName] = curSheetId;
            _goto("offer.htm", query);
            //window.location.reload();
            //init();
        }
    }

    function createTable(column, dataSource) {
        $thead.empty();
        $tbody.empty();
        //thead
        var theadArr = column;
        var $tr = $("<tr>");
        theadArr.slice(0, theadArr.length - 3).map(function (item) {
            $tr.append(
                $("<td>").text(item)
            );
        });
        $thead.append($tr);

        //thbody
        dataSource.map(function (item) {
            var $tr = $("<tr>");
            item.slice(0, item.length - 3).map(function (o) {
                $tr.append(
                    $("<td>").text(o)
                );
            })
            $tbody.append($tr);
        });
    }

    function onSearch(value, field) {
        if (!value || !field) return;
        var curSheetData = data[curSheetId];
        var dataSource = getDataSourceByOrder(curSheetData.list);
        dataSource = dataSource.filter(function (row, i) {
            return (row[Number(field)] || "").indexOf(value) > -1;
        });
        createTable(curSheetData.column, dataSource);
    }


    function _goto(path, query) {
        var search = Object.getOwnPropertyNames(query).map(function (name) {
            return `${name}=${query[name]}`;
        }).join("&");
        window.location.href = `${path}?${search}`;
    }

    function _getQuery() {
        var query = {};
        var href = window.location.href;
        var query_str = href.substring(href.lastIndexOf("?") + 1);
        query_str.replace(/([^=&?]+)=([^=&?]*)/g, (w, $1, $2) => {
            var key = decodeURIComponent($1);
            var val = decodeURIComponent($2);
            query[key] = val;
        });
        return query;
    }

}(Zepto, window.dataSource_adms, window.fieldMap_adms));


