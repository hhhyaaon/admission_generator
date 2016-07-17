
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
} (Zepto));




(function ($, data, map) {

    if (!data) alert("获取录取榜失败");

    var $menu = $(".adms-menu");
    var $header = $(".adms-header");
    var $title = $(".adms-title");
    var $search = $(".adms-search");
    var $thead = $(".adms-table>table>thead");
    var $tbody = $(".adms-table>table>tbody");

    var sheetMap = map.sheetMap;

    var sstName = "country";

    var searchBar = null;
    var search_colum = [
        { id: "4", text: "毕业院校" },
        { id: "5", text: "本科专业" },
        { id: "6", text: "录取院校" },
        { id: "9", text: "录取专业" }
    ];

    init()

    function init() {
        var curSheet = getCurSheet();
        initSearch();
        createDom(curSheet);
    }

    function getCurSheet() {
        var curSheet = _getQuery()[sstName];
        curSheet = curSheet || sheetMap.america.id;
        return curSheet;
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


    function createDom(curSheet) {
        var dataSource = data[curSheet];
        createMenu(curSheet);
        createTable(dataSource);
        setPageDate(curSheet);
    }


    function setPageDate(curSheet) {
        var obj = null;
        Object.getOwnPropertyNames(map.sheetMap).map(function (name) {
            if (map.sheetMap[name].id === curSheet) obj = map.sheetMap[name];
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
        function onClickMenuItem(curSheet) {
            var query = {};
            query[sstName] = curSheet;
            _goto("offer.htm", query);
            //window.location.reload();
            //init();
        }
    }

    function createTable(dataSource) {
        $thead.empty();
        $tbody.empty();
        //thead
        var theadArr = dataSource.slice(0, 1)[0];
        var $tr = $("<tr>");
        theadArr.slice(0, theadArr.length - 3).map(function (item) {
            $tr.append(
                $("<td>").text(item)
            );
        });
        $thead.append($tr);

        //thbody
        dataSource.slice(1).map(function (item) {
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
        var dataSource = data[getCurSheet()];
        var theadArr = dataSource.slice(0, 1);
        var resArr = dataSource.slice(1).filter(function (row, i) {
            return (row[Number(field)] || "").indexOf(value) > -1;
        });
        createTable(theadArr.concat(resArr));
    }


    function _goto(path, query) {
        var search = Object.getOwnPropertyNames(query).map(function (name) {
            return `${name}=${query[name]}`;
        }).join("&");
        window.location.href = `${path}?${search}`;
    }

    function _getQuery() {
        let query = {};
        let href = window.location.href;
        let query_str = href.substring(href.lastIndexOf("?") + 1);
        query_str.replace(/([^=&?]+)=([^=&?]*)/g, (w, $1, $2) => {
            let key = decodeURIComponent($1);
            let val = decodeURIComponent($2);
            query[key] = val;
        });
        return query;
    }

} (Zepto, window.dataSource_adms, window.fieldMap_adms));


