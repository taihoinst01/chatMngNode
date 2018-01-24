(function($, ba, bb, bc) {
    var b = {};
    $.fn.tiJqGrid = function(e) {
        var bd = "";
        var be = 0;
        var bf = 0;
        var bg = function(a, e, b, c, d) {
            var f = $(e.target).closest('tr.jqgrow');
            var g = f.attr('id');
            var h = $("#" + a.id).jqGrid('getRowData', g);
            var i = 'jqg_' + a.id + '_' + g;
            var j = false;
            if (e.target.type == "checkbox") {
                try {
                    if ($("#" + e.currentTarget.id).jqGrid("getCell", g, 'statusFlag') != $.jqgridStatus.flag_delete && $("#" + e.currentTarget.id).jqGrid("getCell", g, 'statusFlag') != $.jqgridStatus.flag_insert) {
                        $("#" + e.currentTarget.id).jqGrid("setCell", g, 'statusFlag', $.jqgridStatus.flag_update)
                    }
                } catch (e) {}
                return true
            } else {
                if (b == $(e.target).val() && (h.statusFlag == bc || $.trim(h.statusFlag) == $.jqgridStatus.flag_normal)) {
                    $("#" + a.id).jqGrid("setCell", g, 'statusFlag', $.jqgridStatus.flag_normal)
                } else if (h.statusFlag == bc || $.trim(h.statusFlag) == $.jqgridStatus.flag_normal) {
                    $("#" + a.id).jqGrid("setCell", g, 'statusFlag', $.jqgridStatus.flag_update);
                    j = true
                }
            }
            if (!$('#' + i).prop("checked") && j) {}
        };
        return this.each(function() {
            var t = this;
            var u = e.colModel;
            var X = e;
            var A = X.editCellValid;
            var B = X.onSelectRow;
            var C = X.onCellSelect;
            var O = X.onRowClick;
            var D = X.onSelectAll;
            var E = X.afterEditCell;
            var F = X.beforeSelectRow;
            var G = X.loadError;
            var I = X.afterInsertRow;
            var v = X.gridComplete;
            var w = X.loadComplete;
            var N = (X.cellEdit == bc ? false : X.cellEdit);
            var H = $.extend({
                id: "id",
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                cell: "cell",
                subgrid: {
                    repeatitems: false
                },
                userdata: function(a) {
                    if (!$.ti.isEmptyVal(a.model) && !$.ti.isEmptyVal(a.model.error_message)) {
                        alert(a.model.error_message)
                    }
                }
            }, H);
            var x = $.extend({
                id: "id",
                repeatitems: false,
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                subgrid: {
                    repeatitems: false
                },
                userdata: function(a) {
                    if (!$.ti.isEmptyVal(a.model) && !$.ti.isEmptyVal(a.model.error_message)) {
                        alert(a.model.error_message)
                    }
                }
            }, x);
            var y = $.extend({
                level_field: "level",
                parent_id_field: "parent",
                leaf_field: "isLeaf",
                expanded_field: "expanded",
                loaded: "loaded",
                icon_field: "icon"
            }, y);
            var z = function(a, b, c) {
                alert(a.responseText)
            };
            var J = z;
            if (G != bc) {
                J = function(a, b, c) {
                    z(a, b, c);
                    G(a, b, c)
                }
            }
            var K = function(a, e) {
                var b = $(e.target);
                var c = b.closest("td");
                var d = c.closest("tr.jqgrow");
                var f = $.jgrid.getCellIndex(c[0]);
                var g = $(this).jqGrid("getGridParam", "colModel");
                if (g[f].name != "cb" && f >= 0 && b.is(":checkbox")) {
                    bg(a, e, "checkbox", f, "")
                }
                return true
            };
            var L = K;
            if (F != bc) {
                L = function(a, e) {
                    K(a, e);
                    F(a, e)
                }
            }
            var M = function(a, b, c, d, e) {
                var f = $(t).jqGrid("getGridParam", "colModel");
                if (f[e].editrules != bc && f[e].editrules.date == true) {
                    bd = a;
                    be = d;
                    bf = e
                } else {
                    $("#" + d + "_" + b, t).bind('blur', function() {
                        $(t).jqGrid('saveCell', d, e)
                    })
                }
            };
            var P = M;
            if (E != bc) {
                P = function(a, b, c, d, e) {
                    M(a, b, c, d, e);
                    E(a, b, c, d, e)
                }
            }
            var Q = function(a, e) {
                if (!e) {
                    for (var i = 0, len = a.length; i < len; i++) {
                        var b = $(t).jqGrid('getRowData', a[i]);
                        if (b.statusFlag == $.jqgridStatus.flag_delete) {
                            $(t).jqGrid('setCell', a[i], 'statusFlag', $.jqgridStatus.flag_normal);
                            $(t).jqgridRowsStateColorChange(a[i])
                        }
                    }
                }
            };
            var R = Q;
            if (D != bc) {
                R = function(a, e) {
                    Q(a, e);
                    D(a, e)
                }
            }
            var S = function(a, b, c, d) {};
            var T = S;
            if (C != bc) {
                T = function(a, b, c, d) {
                    S(a, b, c, d);
                    C(a, b, c, d)
                }
            }
            var U = function(a, b, c) {};
            var V = U;
            if (I != bc) {
                V = function(a, b, c) {
                    U(a, b, c);
                    I(a, b, c)
                }
            }
            var W = function(a, b) {
                var c = $(t).jqGrid('getCell', a, "statusFlag");
                if (c == $.jqgridStatus.flag_delete) {
                    return false
                }
                return true
            };
            var Y = W;
            if (A != bc) {
                Y = function(a, b) {
                    if (W(a, b)) {
                        return A(a, b)
                    }
                    return false
                }
            }
            var Z = function(a) {
                var b = $(t).jqGrid('getGridParam', "loadonce");
                if (b) {
                    $(t).setGridParam({
                        datatype: "local"
                    })
                }
                var a = $(t).jqGrid('getGridParam', 'data');
                $.each(a, function() {
                    $(t).createOriginalData(this.id)
                })
            };
            var bh = Z;
            if (w != bc) {
                bh = function(a) {
                    Z(a);
                    w(a)
                }
            }
            var bi = function() {};
            var bj = bi;
            if (v != bc) {
                bj = function() {
                    bi();
                    v()
                }
            }
            var bk = function(a, e) {
                if ($(t).jqGrid('getGridParam', "multiselect") != bc && $(t).jqGrid('getGridParam', "multiselect") != false) {
                    var b = 'jqg_' + t.id + '_' + a;
                    var c = bb.activeElement;
                    if (b != c.id) {
                        $('#' + b).removeAttr("checked");
                        $(t).jqGrid('setSelection', a, false)
                    } else {
                        if (!$('#' + b).prop("checked") && ($(t).getCell(a, "statusFlag") == $.jqgridStatus.flag_delete)) {
                            $(t).setRestoreStatus(a)
                        }
                    }
                }
            };
            var bl = bk;
            if (B != bc) {
                bl = function(a, e) {
                    bk(a, e);
                    B(a, e)
                }
            }
            var bm = function(a, b, e) {};
            var bn = bm;
            if (O != bc) {
                bn = function(a, b, e) {
                    bm(a, b, e);
                    O(a, b, e)
                }
            }
            var bo = function(a, b, c) {
                return b
            };
            var bp = "";
            try {
                $.each(u, function(f, g) {
                    var h = this;
                    var i = this["editoptions"];
                    var j = this["editrules"];
                    var k = (this["showBtn"] == bc ? false : true);
                    var l = this["edittype"];
                    if (!l) {
                        if (h.name == "statusFlag") {
                            l = "select"
                        } else {
                            l = "text"
                        }
                        this["edittype"] = l
                    }
                    var m = {
                        dataEvents: [{
                            type: 'focus',
                            fn: function(e) {
                                bp = $(e.target).val();
                                if (l == "text" || (l != "select" && l != "checkbox" && l != "radio")) {
                                    ba.setTimeout(function() {
                                        $(e.target).select()
                                    }, 5)
                                }
                            }
                        }, {
                            type: 'blur',
                            fn: function(e) {
                                bg(t, e, bp, f, g)
                            }
                        }, {
                            type: 'focusout',
                            fn: function(e) {
                                bg(t, e, bp, f, g)
                            }
                        }, {
                            type: 'change',
                            fn: function(e) {
                                bg(t, e, bp, f, g)
                            }
                        }, {
                            type: 'keydown',
                            fn: function(e) {
                                var a = e.charCode || e.keyCode;
                                if (a == 9 || a == 13) bg(t, e, bp, f, g)
                            }
                        }]
                    };
                    if (this["editoptions"] == bc) {
                        this["editoptions"] = m
                    }
                    if (this["cellattr"] == bc) {
                        this["cellattr"] = bo
                    }
                    switch (l) {
                        case "search":
                            var n = $.extend({}, this["editrules"] || {});
                            this["edittype"] = "custom";
                            this["editoptions"].custom_element = function(a, b) {
                                var c = '<input type="text" style="margin-top:3px; border:0; width:89%; font-size:12px;" disabled ';
                                c += 'value="' + (a == bc || typeof(a) == bc || $.trim(a) == '' ? '' : a) + '" />';
                                c += '<input class="btn_gridsearch" type="button" />';
                                var d = $(c);
                                return d
                            };
                            this["editoptions"].custom_value = function(a) {
                                return ($(a).val() == bc || typeof($(a).val()) == bc ? '' : $(a).val())
                            };
                            this["formatter"] = "search";
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "textarea":
                            var o = ($.browser.msie ? 2 : 1);
                            this["editoptions"] = $.extend(true, {
                                rows: o
                            }, this["editoptions"]);
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "select":
                            if (h.name == "statusFlag") {
                                var p = {
                                    value: $.jqgridStatus.flag_normal + ":" + $.jqgridStatus.text_normal + ";" + $.jqgridStatus.flag_insert + ":" + $.jqgridStatus.text_insert + ";" + $.jqgridStatus.flag_update + ":" + $.jqgridStatus.text_update + ";" + $.jqgridStatus.flag_delete + ":" + $.jqgridStatus.text_delete
                                };
                                this["editable"] = false;
                                this["editoptions"] = $.extend(true, p, this["editoptions"])
                            } else {
                                this["editoptions"] = $.extend(true, m, i)
                            }
                            this["formatter"] = "select";
                            break;
                        case "checkbox":
                            var q = false;
                            if (!h.editable || !N) q = true;
                            this["align"] = "center";
                            this["sortable"] = false;
                            this["resizable"] = false;
                            this["search"] = false;
                            this["hidedlg"] = true;
                            this["fixed"] = true;
                            this["editoptions"] = $.extend(true, {
                                value: "Y:N",
                                defaultValue: "N",
                                selectAll: false
                            }, this["editoptions"]);
                            if (!$.isFunction(h.formatter)) {
                                this["formatter"] = "checkbox"
                            }
                            this["formatoptions"] = $.extend(true, {
                                disabled: q
                            }, this["formatoptions"]);
                            break;
                        case "radio":
                            var q = false;
                            if (!h.editable || !N) q = true;
                            this["align"] = "center";
                            this["sortable"] = false;
                            this["resizable"] = false;
                            this["search"] = false;
                            this["hidedlg"] = true;
                            this["fixed"] = true;
                            this["editoptions"] = $.extend(true, {
                                value: "",
                                defaultValue: "",
                                groupNm: ""
                            }, this["editoptions"]);
                            if (!$.isFunction(h.formatter)) {
                                this["formatter"] = "radio"
                            }
                            this["formatoptions"] = $.extend(true, {
                                disabled: q
                            }, this["formatoptions"]);
                            break;
                        case "currency":
                            this["align"] = "right";
                            this["sorttype"] = "integer";
                            this["edittype"] = "text";
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "ime-mode": "disabled",
                                    "text-align": "right"
                                })
                            };
                            this["formatter"] = "currency";
                            this["formatoptions"] = $.extend(true, {
                                thousandsSeparator: ",",
                                decimalPlaces: 0
                            }, this["formatoptions"]);
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "number":
                            this["align"] = "right";
                            this["sorttype"] = "integer";
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].number = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "ime-mode": "disabled",
                                    "text-align": "right"
                                })
                            };
                            this["formatter"] = "number";
                            this["formatoptions"] = $.extend(true, {
                                defaultValue: "0"
                            }, this["formatoptions"]);
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "integer":
                            this["align"] = "right";
                            this["sorttype"] = "integer";
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].number = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "ime-mode": "disabled",
                                    "text-align": "right"
                                })
                            };
                            this["formatter"] = "integer";
                            this["formatoptions"] = $.extend(true, {
                                defaultValue: "0"
                            }, this["formatoptions"]);
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "decimal":
                            this["align"] = "right";
                            this["sorttype"] = "integer";
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].decimal = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "ime-mode": "disabled",
                                    "text-align": "right"
                                })
                            };
                            this["formatter"] = "number";
                            this["formatoptions"] = $.extend(true, {
                                defaultValue: "0.00",
                                thousandsSeparator: "",
                                decimalSeparator: ".",
                                decimalPlaces: 2
                            }, this["formatoptions"]);
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "korean":
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].korean = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "ime-mode": "disabled",
                                    "text-align": "right"
                                }).numberFormat({
                                    type: l,
                                    format: $.formatoptions.fmt,
                                    negative: $.formatoptions.neg
                                })
                            };
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "alpha":
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].alpha = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "ime-mode": "disabled",
                                    "text-align": "right"
                                }).numberFormat({
                                    type: l,
                                    format: $.formatoptions.fmt,
                                    negative: $.formatoptions.neg
                                })
                            };
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "alphanum":
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].alphanum = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css("ime-mode", "disabled").keyFilter(/[a-zA-Z0-9]/g)
                            };
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "loweralpha":
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].loweralpha = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css("ime-mode", "disabled").keyFilter(/[a-z]/g)
                            };
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "upperalphanum":
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].upperalphanum = true;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css("ime-mode", "disabled").keyFilter(/[A-Z0-9]/g)
                            };
                            this["editoptions"] = $.extend(true, m, i);
                            break;
                        case "time":
                            this["sorttype"] = "integer";
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].date = true;
                            var r = "H" + TIME_SEP + "i" + TIME_SEP + "s";
                            var s = "99" + TIME_SEP + "99" + TIME_SEP + "99";
                            this["datefmt"] = r;
                            this["editoptions"].dataInit = function(a) {
                                $(a).css({
                                    "text-align": "center"
                                });
                                $(a).attr("edittype", l);
                                $(a).mask(s)
                            };
                            this["formatoptions"] = $.extend(true, {
                                srcformat: r.replace(/[\/\_\-.:\s]/gi, ""),
                                newformat: r
                            }, this["formatoptions"]);
                            break;
                        case "date":
                            this["sorttype"] = "integer";
                            this["edittype"] = "text";
                            this["editrules"] = this["editrules"] || {};
                            this["editrules"].date = true;
                            var r = "Y" + DATE_SEP + "m" + DATE_SEP + "d";
                            var s = "9999" + DATE_SEP + "99" + DATE_SEP + "99";
                            this["datefmt"] = r;
                            this["editoptions"].dataInit = function(d) {
                                $(d).css({
                                    "text-align": "center"
                                });
                                $(d).attr("edittype", l);
                                $(d).mask(s);
                                if (k) {
                                    $(d).datepicker({
                                        dateFormat: 'yy-mm-dd',
                                        defaultDate: "0d",
                                        constrainInput: true,
                                        buttonImageOnly: true,
                                        changeMonth: true,
                                        changeYear: true,
                                        showButtonPanel: true,
                                        currentText: '오늘',
                                        closeText: '닫기',
                                        size: 10,
                                        maxlengh: 10,
                                        buttonImage: "/images/common/datebox_arrow.png",
                                        showOn: ((this["showBtn"] == "false") ? "focus" : "button"),
                                        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                                        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                                        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                                        onClose: function(a, b) {
                                            b.input.css("zIndex", "");
                                            if (!j.required) {
                                                a = a.replace(/[\/\_\-.:\s]/gi, "")
                                            }
                                            b.input.select();
                                            this.blur()
                                        },
                                        onSelect: function(a, b) {
                                            $(t).jqGrid("saveCell", be, bf);
                                            var c = $(t).jqGrid('getCell', bd, 'statusFlag');
                                            if (!c || c == bc || $.trim(c) == $.jqgridStatus.flag_normal) {
                                                $(t).jqGrid("setCell", bd, 'statusFlag', $.jqgridStatus.flag_update)
                                            }
                                            be = 0;
                                            bf = 0;
                                            bd = ""
                                        }
                                    }).css("ime-mode", "disabled").width($(d).width() - 20)
                                } else {
                                    $(d).datepicker({
                                        dateFormat: 'yy-mm-dd',
                                        defaultDate: "0d",
                                        constrainInput: false,
                                        changeMonth: true,
                                        changeYear: true,
                                        showButtonPanel: true,
                                        currentText: '오늘',
                                        closeText: '닫기',
                                        size: 10,
                                        maxlengh: 10,
                                        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                                        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                                        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                                        onClose: function(a, b) {
                                            b.input.css("zIndex", "");
                                            if (!j.required) {
                                                a = a.replace(/[\/\_\-.:\s]/gi, "")
                                            }
                                            b.input.select();
                                            this.blur()
                                        },
                                        onSelect: function(a, b) {
                                            $(t).jqGrid("saveCell", be, bf);
                                            var c = $(t).jqGrid('getCell', bd, 'statusFlag');
                                            if (!c || c == bc || $.trim(c) == $.jqgridStatus.flag_normal) {
                                                $(t).jqGrid("setCell", bd, 'statusFlag', $.jqgridStatus.flag_update)
                                            }
                                            be = 0;
                                            bf = 0;
                                            bd = ""
                                        }
                                    })
                                }
                            };
                            this["formatoptions"] = $.extend(true, {
                                srcformat: r.replace(/[\/\_\-.:\s]/gi, ""),
                                newformat: r
                            }, this["formatoptions"]);
                            break
                    }
                });
                var bq = $(t).jqGrid({
                    url: (X.url == bc ? bc : X.url),
                    postData: (X.postData == bc ? {} : X.postData),
                    loadui: (X.loadui == bc ? "block" : X.loadui),
                    datatype: (X.datatype == bc ? "local" : X.datatype),
                    colNames: (X.colNames == bc ? [] : X.colNames),
                    colModel: (X.colModel == bc ? u : X.colModel),
                    rowNum: (X.rowNum == bc ? 200 : X.rowNum),
                    gridview: (X.gridview == bc ? true : X.gridview),
                    loadonce: (X.loadonce == bc ? true : X.loadonce),
                    scroll: (X.scroll == bc ? true : X.scroll),
                    scrollTimeout: (X.scrollTimeout == bc ? 100 : X.scrollTimeout),
                    rowList: (X.rowList == bc ? [10, 50, 100] : X.rowList),
                    mtype: (X.mtype == bc ? "POST" : X.mtype),
                    autowidth: (X.autowidth == bc ? true : X.autowidth),
                    width: (X.width == bc ? bc : X.width),
                    height: (X.height == bc ? bc : X.height),
                    pager: (X.pager == bc ? bc : X.pager),
                    viewrecords: (X.viewrecords == bc ? true : X.viewrecords),
                    rownumbers: (X.rownumbers == bc ? true : X.rownumbers),
                    multiselect: (X.multiselect == bc ? false : X.multiselect),
                    multiboxonly: (X.multiboxonly == bc ? false : X.multiboxonly),
                    hoverrows: (X.hoverrows == bc ? true : X.hoverrows),
                    shrinkToFit: (X.shrinkToFit == bc ? false : X.shrinkToFit),
                    forceFit: (X.forceFit == bc ? false : X.forceFit),
                    viewsortcols: [true, "vertical", true],
                    sortorder: (X.sortorder == bc ? "ASC" : X.sortorder),
                    sortname: (X.sortname == bc ? '' : X.sortname),
                    altRows: (X.altRows == bc ? true : X.altRows),
                    selarrrow: (X.selarrrow == bc ? [] : X.selarrrow),
                    selrow: (X.selrow == bc ? bc : X.selrow),
                    savedRow: (X.savedRow == bc ? [] : X.savedRow),
                    sortable: (X.sortable == bc ? false : X.sortable),
                    reccount: (X.reccount == bc ? 0 : X.reccount),
                    lastpage: (X.lastpage == bc ? 0 : X.lastpage),
                    lastsort: (X.lastsort == bc ? 0 : X.lastsort),
                    caption: (X.caption == bc ? bc : X.caption),
                    page: (X.page == bc ? 1 : X.page),
                    pagerpos: (X.pagerpos == bc ? "center" : X.pagerpos),
                    ignoreCase: (X.ignoreCase == bc ? false : X.ignoreCase),
                    autoencode: (X.autoencode == bc ? false : X.autoencode),
                    scrollrows: (X.scrollrows == bc ? true : X.scrollrows),
                    gridmode: (X.gridmode == bc ? "cellEdit" : X.gridmode),
                    editmode: (X.editmode == bc ? false : X.editmode),
                    cellEdit: (X.cellEdit == bc ? false : X.cellEdit),
                    cellsubmit: ((X.cellEdit == bc ? false : X.cellEdit) == true ? 'clientArray' : bc),
                    jsonReader: x,
                    localReader: H,
                    gridComplete: bj,
                    loadError: J,
                    onPaging: (X.onPaging == bc ? null : X.onPaging),
                    onSelectRow: bl,
                    onSelectAll: R,
                    onSortCol: (X.onSortCol == bc ? null : X.onSortCol),
                    ondblClickRow: (X.ondblClickRow == bc ? bc : X.ondblClickRow),
                    afterEditCell: P,
                    afterInsertRow: (X.afterInsertRow == bc ? V : X.afterInsertRow),
                    deepempty: (X.deepempty == bc ? false : X.deepempty),
                    deselectAfterSort: (X.deselectAfterSort == bc ? true : X.deselectAfterSort),
                    loadComplete: bh,
                    footerrow: (X.footerrow == bc ? false : X.footerrow),
                    userDataOnFooter: (X.userDataOnFooter == bc ? false : X.userDataOnFooter),
                    sortable: (X.sortable == bc ? true : X.sortable),
                    editCellValid: Y,
                    onRowClick: bn,
                    cmTemplate: (X.cmTemplate == bc ? {
                        title: false
                    } : X.cmTemplate),
                    loadBeforeSend: (X.loadBeforeSend == bc ? false : X.loadBeforeSend),
                    beforeProcessing: (X.beforeProcessing == bc ? false : X.beforeProcessing),
                    beforeRequest: (X.beforeRequest == bc ? false : X.beforeRequest),
                    onHeaderClick: (X.onHeaderClick == bc ? false : X.onHeaderClick),
                    multikey: (X.multikey == bc ? false : X.multikey),
                    hidegrid: (X.hidegrid == bc ? true : X.hidegrid),
                    hiddengrid: (X.hiddengrid == bc ? false : X.hiddengrid),
                    grouping: (X.grouping == bc ? false : X.grouping),
                    groupingView: (X.groupingView == bc ? bc : X.groupingView),
                    treeGrid: (X.treeGrid == bc ? false : X.treeGrid),
                    treedatatype: (X.treedatatype == bc ? "local" : X.treedatatype),
                    treeGridModel: (X.treeGridModel == bc ? "adjacency" : X.treeGridModel),
                    tree_root_level: (X.tree_root_level == bc ? 0 : X.tree_root_level),
                    treeReader: (X.treeReader == bc ? y : X.treeReader),
                    treeANode: (X.treeANode == bc ? -1 : X.treeANode),
                    ExpandColClick: (X.ExpandColClick == bc ? true : X.ExpandColClick),
                    ExpandColumn: (X.ExpandColumn == bc ? bc : X.ExpandColumn),
                    scrollOffset: (X.scrollOffset == bc ? '18' : X.scrollOffset),
                    gridstate: (X.gridstate == bc ? "visible" : X.gridstate),
                    inlineData: (X.inlineData == bc ? [] : X.inlineData),
                    beforeSelectRow: L,
                    onCellSelect: T,
                    enterEditCell: (X.enterEditCell == bc ? bc : X.enterEditCell),
                    beforeAddCell: (X.beforeAddCell == bc ? bc : X.beforeAddCell),
                    afterAddCell: (X.afterAddCell == bc ? bc : X.afterAddCell),
                    beforeSaveRow: (X.beforeSaveRow == bc ? bc : X.beforeSaveRow),
                    afterSaveRow: (X.afterSaveRow == bc ? bc : X.afterSaveRow),
                    afterRestoreCell: (X.afterRestoreCell == bc ? bc : X.afterRestoreCell),
                    afterSaveCell: (X.afterSaveCell == bc ? bc : X.afterSaveCell),
                    afterSubmitCell: (X.afterSubmitCell == bc ? bc : X.afterSubmitCell),
                    beforeEditCell: (X.beforeEditCell == bc ? bc : X.beforeEditCell),
                    beforeSaveCell: (X.beforeSaveCell == bc ? bc : X.beforeSaveCell),
                    beforeSubmitCell: (X.beforeSubmitCell == bc ? bc : X.beforeSubmitCell),
                    errorCell: (X.errorCell == bc ? bc : X.errorCell),
                    formatCell: (X.formatCell == bc ? bc : X.formatCell),
                    onSelectCell: (X.onSelectCell == bc ? bc : X.onSelectCell),
                    ondblClickCell: (X.ondblClickCell == bc ? bc : X.ondblClickCell),
                    onRightClickCell: (X.onRightClickCell == bc ? bc : X.onRightClickCell),
                    ajaxGridOptions: (X.ajaxGridOptions == bc ? bc : X.ajaxGridOptions),
                    ajaxSelectOptions: (X.ajaxSelectOptions == bc ? bc : X.ajaxSelectOptions),
                    altclass: (X.altclass == bc ? bc : X.altclass),
                    direction: (X.direction == bc ? bc : X.direction),
                    emptyrecords: (X.emptyrecords == bc ? bc : X.emptyrecords),
                    multiSort: (X.multiSort == bc ? false : X.multiSort),
                    pgbuttons: (X.pgbuttons == bc ? true : X.pgbuttons),
                    subGrid: (X.subGrid == bc ? false : X.subGrid),
                    subGridOptions: (X.subGridOptions == bc ? bc : X.subGridOptions),
                    subGridModel: (X.subGridModel == bc ? bc : X.subGridModel),
                    subGridType: (X.subGridType == bc ? bc : X.subGridType),
                    subGridUrl: (X.subGridUrl == bc ? bc : X.subGridUrl),
                    subGridWidth: (X.subGridWidth == bc ? 20 : X.subGridWidth),
                    toolbar: (X.toolbar == bc ? bc : X.toolbar)
                })
            } catch (ex) {
                return alert(ex)
            }
        })
    };
    $.extend({
        jqgridStatus: {
            flag_normal: "_",
            flag_insert: "I",
            flag_update: "U",
            flag_delete: "D",
            text_normal: "",
            text_insert: "NEW",
            text_update: "EDIT",
            text_delete: "DEL"
        }
    });
    $.jgrid.extend({
        setGridToForm: function(b, c) {
            return this.each(function() {
                var g = this;
                if (!g.grid) {
                    return
                }
                var j = $(g).jqGrid("getRowData", b);
                if (j) {
                    $.ti.jsonToForm(j, c);
                    $.tinit.objInit()
                }
            })
        },
        getMaxRowId: function() {
            return $(this).getDataIDs().length
        },
        getCheckedRowId: function() {
            var d = this;
            var s = d.jqGrid('getGridParam', 'selarrrow');
            return s
        },
        hideColumns: function(b) {
            return this.each(function() {
                var c = this;
                $(c.p.colModel).each(function() {
                    for (var d = 0; d < b.length; d++) {
                        if (this.name == b[d]) {
                            this.hidedlg = true
                        }
                    }
                });
                $(this).jqGrid("showHideCol", b, "none")
            })
        },
        showColumns: function(b) {
            return this.each(function() {
                var c = this;
                $(c.p.colModel).each(function() {
                    for (var d = 0; d < b.length; d++) {
                        if (this.name == b[d]) {
                            this.hidedlg = false
                        }
                    }
                });
                $(this).jqGrid("showHideCol", b, "")
            })
        },
        getCellIndex: function(d) {
            var c = this[0],
                b = -1;
            if (isNaN(d)) {
                $(c.p.colModel).each(function(e) {
                    if (this.name == d) {
                        b = e;
                        return false
                    }
                })
            } else {
                b = parseInt(d, 10)
            }
            return b
        },
        getCellName: function(b) {
            var c = this[0],
                d = "";
            if (b) {
                $(c.p.colModel).each(function(e) {
                    if (e == b) {
                        d = this.name;
                        return false
                    }
                })
            }
            return d
        },
        addGridRow: function(k) {
            var c = this;
            var a = $.extend({}, {
                statusFlag: $.jqgridStatus.flag_insert
            }, k.initdata);
            var b = $.jgrid.randId("new");
            if (k.position == 'after' || k.position == 'before') {
                var d = $(c).jqGrid('getGridParam', 'selrow');
                $(c).jqGrid('addRowData', b, a, k.position, d)
            } else {
                $(c).jqGrid('addRowData', b, a, k.position)
            }
            var e = 'jqg_' + c.id + '_' + b;
            var f = bb.activeElement;
            if (e != f.id) {
                $('#' + e).attr("checked")
            }
            $(c).jqGrid('setSelection', b, true, true);
            if (typeof k.callback == 'function') k.callback()
        },
        delGridRow: function(b) {
            return this.each(function() {
                var m = this;
                var j = new Array();
                if ($.isArray(b.rowid)) {
                    $.extend(j, b.rowid)
                } else {
                    if (!isNaN(parseInt(b.rowid))) {
                        j.push(b.rowid)
                    }
                }
                if ($(m).jqGrid('getGridParam', "multiselect") != bc && $(m).jqGrid('getGridParam', "multiselect") != false) {
                    if (j.length > 1) {
                        for (var i = 0, len = j.length; i < len; i++) {
                            if ($(m).jqGrid('getCell', j[i], "statusFlag") == $.jqgridStatus.flag_insert) {
                                $(m).delRowData(j[i])
                            } else {
                                $(m).jqGrid('setCell', j[i], "statusFlag", $.jqgridStatus.flag_delete);
                                $(m).jqgridRowsStateColorChange(j[i])
                            }
                        }
                    } else {
                        if ($(m).jqGrid('getCell', j, "statusFlag") == $.jqgridStatus.flag_insert) {
                            $(m).delRowData(j)
                        } else {
                            $(m).jqGrid('setCell', j, 'statusFlag', $.jqgridStatus.flag_delete);
                            $(m).jqgridRowsStateColorChange(j)
                        }
                    }
                }
            })
        },
        setRestoreStatus: function(i) {
            return this.each(function() {
                var b = this;
                var u = $(b).getDataIDs(true);
                if (i == bc) {
                    $(u).each(function(d, f) {
                        var e = $(b).getCell(f, "statusFlag");
                        if (e == $.jqgridStatus.flag_insert) {
                            $(b).delRowData(f)
                        } else {
                            var a = 'jqg_' + b.id + '_' + f;
                            if ($('#' + a).prop("checked")) {
                                var c = bb.activeElement;
                                if (a != c.id) {
                                    $('#' + a).removeAttr("checked");
                                    $(b).setSelection(f, false)
                                }
                            }
                            if (e == $.jqgridStatus.flag_update) {
                                $(b).restoreRow(f);
                                $(b).jqGrid('setCell', f, "statusFlag", $.jqgridStatus.flag_normal)
                            } else {
                                if (e == $.jqgridStatus.flag_delete) {
                                    $(b).restoreRow(f);
                                    $(b).jqGrid('setCell', f, "statusFlag", $.jqgridStatus.flag_normal)
                                }
                            }
                            $(b).jqgridRowsStateColorChange(f)
                        }
                    })
                } else {
                    var f = i;
                    var e = $(b).getCell(f, "statusFlag");
                    if (e == $.jqgridStatus.flag_insert) {
                        $(b).delRowData(f)
                    } else {
                        var g = 'jqg_' + b.id + '_' + f;
                        if ($('#' + g).prop("checked")) {
                            var h = bb.activeElement;
                            if (g != h.id) {
                                $('#' + g).removeAttr("checked");
                                $(b).setSelection(f, false)
                            }
                        }
                        if (e == $.jqgridStatus.flag_update) {
                            $(b).restoreRow(f);
                            $(b).jqGrid('setCell', f, "statusFlag", $.jqgridStatus.flag_normal)
                        } else {
                            if (e == $.jqgridStatus.flag_delete) {
                                $(b).restoreRow(f);
                                $(b).jqGrid('setCell', f, "statusFlag", $.jqgridStatus.flag_normal)
                            }
                        }
                        $(b).jqgridRowsStateColorChange(f)
                    }
                }
            })
        },
        setRestoreGrid: function() {
            return this.each(function() {
                var f = this;
                $('#cb_' + f.id).removeAttr("checked");
                if (!f.p) {
                    return
                }
                if ($(f)[0].p.initData === bc) {
                    return
                }
                var b = $(f)[0].p.initData;
                var c = f.p.loadonce;
                if (c) {
                    $(f).setGridParam({
                        datatype: "json"
                    })
                }
                $(f).clearGridData();
                if (b) {
                    $(f)[0].addJSONData({
                        total: 1,
                        page: 1,
                        records: b.length,
                        rows: b
                    })
                }
            })
        },
        setUiGridWidthResize: function(b, c) {
            var g = this;
            $(ba).bind('resize', function() {
                var a = $(b, parent.document).width() - c;
                if (a > 0 && Math.abs(a - $(g).width()) > 5) {
                    $(g).setGridWidth(a)
                }
            }).trigger('resize')
        },
        createOriginalData: function(b) {
            return this.each(function() {
                var c = this;
                if (!c.p) {
                    return
                }
                if (c.p.originalData === bc) {
                    c.p.originalData = {}
                }
                if (c.p.originalData[b] == bc) {
                    var e = {};
                    if (typeof(b) !== "undefined") {
                        var d = c.p._index[b];
                        if (d >= 0) {
                            $(c.p.colModel).each(function(f) {
                                if (c.p.initData[d][this.name]) {
                                    e[this.name] = c.p.initData[d][this.name]
                                } else {
                                    e[this.name] = ""
                                }
                                if (this.formatter == "radio" && e[this.name]) {
                                    e[this.editoptions.groupNm] = e[this.name]
                                }
                            })
                        }
                    }
                    c.p.originalData[b] = $.extend({}, {}, e)
                }
            })
        },
        clearOriginalData: function() {
            return this.each(function() {
                var b = this;
                if (!b.p) {
                    return
                }
                if (b.p.originalData !== bc) {
                    b.p.originalData = {}
                }
                $.each(b.p.initData, function() {
                    this.stateFlag = ""
                })
            })
        },
        setData: function(b, k, j, p, t) {
            try {
                return this.each(function() {
                    var f = this;
                    var c = f.p.loadonce;
                    var m = (j == bc ? 1 : j);
                    var h = (p == bc ? 1 : p);
                    if (c) {
                        $(f).setGridParam({
                            datatype: "json"
                        })
                    }
                    if (k) $(f).clearGridData();
                    if (k) $(f).clearOriginalData();
                    if (b) {
                        if (f.p.treeGrid === true) {
                            if ($.isFunction(f.p.loadComplete)) {
                                f.p.loadComplete.call(f, b)
                            }
                        } else {
                            if (b[f.p.localReader.userdata]) {
                                f.p.userData = b[f.p.localReader.userdata]
                            }
                        }
                        $(f)[0].p.initData = b;
                        $(f)[0].addJSONData({
                            total: m,
                            page: h,
                            records: t,
                            rows: b
                        });
                        if ($.isFunction(f.p.loadComplete)) {
                            f.p.loadComplete.call(f, b)
                        }
                    }
                    if (c) {
                        $(f).setGridParam({
                            datatype: "local"
                        })
                    }
                })
            } catch (e) {
                console.log(e)
            } finally {
                b = null
            }
        },
        setRowSpan: function() {
            return this.each(function() {
                var e = this;
                var d = $(e).getDataIDs(true);
                if (d.length == 0) {
                    return false
                }
                var c = e.p.colModel;
                var b;
                $.each(c, function(f) {
                    if (this.rowspanBase === true) {
                        b = this.name;
                        return false
                    }
                });
                $.each(c, function(f) {
                    if (!this.rowspan) {
                        return
                    }
                    var h = this;
                    $("td[aria-describedby$=" + h.name + "]", e).each(function(j) {
                        if (h.rowspan) {
                            $(this).removeAttr("rowspan").show()
                        }
                    });
                    var g = null;
                    $("td[aria-describedby$=" + h.name + "]", e).each(function(l) {
                        var k = true;
                        var j = $("td[aria-describedby$=" + b + "]", e).eq(l - 1).attr("title");
                        var m = $("td[aria-describedby$=" + b + "]", e).eq(l).attr("title");
                        if (j != m) {
                            k = false
                        }
                        if (g != null && $(this).attr("title") == $(g).attr("title")) {
                            if (h.rowspanBase !== true) {
                                if (k === false) {
                                    g = this;
                                    return
                                }
                            }
                            if (h.rowspan == "merge") {
                                var n = $(g).prop("rowspan");
                                if ($(this).is(":visible")) {
                                    if (h.rowspanTop) {
                                        $(g).css({
                                            "vertical-align": "top",
                                            "padding-top": h.rowspanTop
                                        })
                                    }
                                    if (n == bc) {
                                        $(g).prop("rowspan", 2)
                                    } else {
                                        $(g).prop("rowspan", Number(n) + 1)
                                    }
                                    $(g).show();
                                    $(this).hide()
                                }
                            } else {
                                if (h.rowspan == "space") {
                                    $(this).html("&#160;")
                                }
                            }
                        } else {
                            g = this
                        }
                    })
                });
                c = null
            })
        },
        setSelectionGrid: function(h, k, a) {
            var f = this;
            if ($(f).jqGrid('getGridParam', "multiselect") != bc && $(f).jqGrid('getGridParam', "multiselect") != false && a == true) {
                var b = 'jqg_' + f[0].id + '_jqg' + h;
                if ($(f)[0].p.onSelectRow) {
                    $(f)[0].p.onSelectRow.call(f, 'jqg' + h)
                } else {
                    $(f).jqGrid('setSelection', 'jqg' + h, false)
                }
            } else {
                if (k == bc) {
                    $('#' + f[0].id + ' tbody:first-child tr:eq(' + h + ') td:eq(0)').trigger('click')
                } else {
                    $('#' + f[0].id + ' tbody:first-child tr:eq(' + h + ') td:eq(' + k + ')').trigger('click')
                }
            }
        },
        gridExcelExport: function(k) {
            var b = this;
            var d = 0;
            var i = false;
            var c = null;
            var j = new Array();
            var g = k.excludeCol || [];
            var f = null;
            g.push("rn");
            g.push("cb");
            d = $(b).getGridParam("records");
            if (d <= 0) {
                alert("데이터가 없습니다.");
                return
            }
            if (d > 0) {
                c = $(b).jqgridDataInfo(b, k.title, g)
            }
            var e = new Object();
            e.exportData = c;
            if (k.addParams != bc) {
                for (var b in k.addParams) {
                    e[b] = k.addParams[b]
                }
            }
            if (k.chartData != bc) {
                e.chartData = k.chartData
            }
            if (k.url == bc) f = "/web/file/jqgridExcelDownloadList.do";
            else f = k.url;
            $.ti.submitDynamicForm(k.applyId, f, 'post', e)
        },
        setSelection: function(d, f, e) {
            return this.each(function() {
                var c = this,
                    stat, pt, ner, ia, tpsr, fid, csr;
                if (d === bc) {
                    return
                }
                f = f === false ? false : true;
                pt = $(c).jqGrid('getGridRowById', d);
                if (!pt || !pt.className || pt.className.indexOf('ui-state-disabled') > -1) {
                    return
                }

                function scrGrid(a) {
                    var b = $(c.grid.bDiv)[0].clientHeight,
                        st = $(c.grid.bDiv)[0].scrollTop,
                        rpos = $(c.rows[a]).position().top,
                        rh = c.rows[a].clientHeight;
                    if (rpos + rh >= b + st) {
                        $(c.grid.bDiv)[0].scrollTop = rpos - (b + st) + rh + st
                    } else if (rpos < b + st) {
                        if (rpos < st) {
                            $(c.grid.bDiv)[0].scrollTop = rpos
                        }
                    }
                }
                if (c.p.scrollrows === true) {
                    ner = $(c).jqGrid('getGridRowById', d).rowIndex;
                    if (ner >= 0) {
                        scrGrid(ner)
                    }
                }
                if (c.p.frozenColumns === true) {
                    fid = c.p.id + "_frozen"
                }
                if (!c.p.multiselect) {
                    if (pt.className !== "ui-subgrid") {
                        if (c.p.selrow !== pt.id) {
                            csr = $(c).jqGrid('getGridRowById', c.p.selrow);
                            if (csr) {
                                $(csr).removeClass("ui-state-highlight").attr({
                                    "aria-selected": "false",
                                    "tabindex": "-1"
                                })
                            }
                            $(pt).addClass("ui-state-highlight").attr({
                                "aria-selected": "true",
                                "tabindex": "0"
                            });
                            if (fid) {
                                $("#" + $.jgrid.jqID(c.p.selrow), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight");
                                $("#" + $.jgrid.jqID(d), "#" + $.jgrid.jqID(fid)).addClass("ui-state-highlight")
                            }
                            stat = true
                        } else {
                            stat = false
                        }
                        c.p.selrow = pt.id;
                        if (f) {
                            $(c).triggerHandler("jqGridSelectRow", [pt.id, stat, e]);
                            if (c.p.onSelectRow) {
                                c.p.onSelectRow.call(c, pt.id, stat, e)
                            }
                        }
                    }
                } else {
                    c.setHeadCheckBox(false);
                    c.p.selrow = pt.id;
                    ia = $.inArray(c.p.selrow, c.p.selarrrow);
                    if (ia === -1) {
                        if (pt.className !== "ui-subgrid") {
                            $(pt).addClass("ui-state-highlight").attr("aria-selected", "true")
                        }
                        stat = true;
                        c.p.selarrrow.push(c.p.selrow)
                    } else {
                        if (pt.className !== "ui-subgrid") {
                            $(pt).removeClass("ui-state-highlight").attr("aria-selected", "false")
                        }
                        stat = false;
                        c.p.selarrrow.splice(ia, 1);
                        tpsr = c.p.selarrrow[0];
                        c.p.selrow = (tpsr === bc) ? null : tpsr
                    }
                    $("#jqg_" + $.jgrid.jqID(c.p.id) + "_" + $.jgrid.jqID(pt.id))[c.p.useProp ? 'prop' : 'attr']("checked", stat);
                    if (fid) {
                        if (ia === -1) {
                            $("#" + $.jgrid.jqID(d), "#" + $.jgrid.jqID(fid)).addClass("ui-state-highlight")
                        } else {
                            $("#" + $.jgrid.jqID(d), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight")
                        }
                        $("#jqg_" + $.jgrid.jqID(c.p.id) + "_" + $.jgrid.jqID(d), "#" + $.jgrid.jqID(fid))[c.p.useProp ? 'prop' : 'attr']("checked", stat)
                    }
                    if (f) {
                        $(c).triggerHandler("jqGridSelectRow", [pt.id, stat, e]);
                        if (c.p.onSelectRow) {
                            c.p.onSelectRow.call(c, pt.id, stat, e)
                        }
                    }
                }
            })
        },
        pagingNaviInit: function(k) {
            return this.each(function() {
                var c = this;
                $(c).closest('.ui-jqgrid').find('#next_pager, #prev_pager, #last_pager, #first_pager').on('click', function(e) {
                    if (typeof k.callback == 'function') k.callback()
                });
                $(c).closest('.ui-jqgrid').find('.ui-pg-selbox').on('change', function(e) {
                    if (typeof k.callback == 'function') k.callback()
                });
                $(c).closest('.ui-jqgrid').find('.ui-pg-input').on('keypress', function(e) {
                    if (e.keyCode == 13) {
                        if (typeof k.callback == 'function') k.callback()
                    }
                })
            })
        },
        tiJqgridInit: function(k) {
            return this.each(function() {
                var c = this;
                var b = $("thead:first", $(c)).get(0);
                var d = $("tr:first", b);
                $("th", d).each(function(j) {
                    var a = $(c)[0].p.colModel[j].sortable;
                    if (a == true) {
                        $(this).on('click', function() {
                            if (typeof k.callback == 'function') k.callback()
                        })
                    }
                })
            })
        }
    });
    $.fn.getArrayFromGridRow = function(d) {
        var f = false;
        if (arguments.length > 0 && d == true) {
            f = true
        }
        var g = [];
        var h = new Array();
        try {
            var i = this;
            if (i.jqGrid == null || i.jqGrid == bc) {
                return []
            }
            var j = (f ? i.jqGrid('getGridParam', "selarrrow") : i.getDataIDs());
            if (f) {
                $.each(j, function(a, b) {
                    h.push(i.jqGrid('getRowData', b))
                })
            } else {
                var k = 0;
                $.each(j, function(a, b) {
                    var c = i.jqGrid('getRowData', b);
                    if (typeof c.statusFlag != "undefined" && c.statusFlag != $.jqgridStatus.flag_normal && c.statusFlag != null) {
                        h.push(c)
                    }
                })
            }
            if (h.length == 0) {
                return []
            }
        } catch (e) {
            alert(e.message);
            return h
        }
        return h
    };
    $.fn.getArrayFromMultiSelectedRow = function() {
        return this.getArrayFromGridRow(true)
    };
    $.fn.getArrayFromAllRow = function() {
        return this.getArrayFromGridRow(false)
    };
    $.fn.jqgridRowspan = function(f) {
        var g = [];
        $.each(this.jqGrid('getGridParam', "colModel"), function(a, b) {
            g.push(b.name)
        });
        var h = this.getCol(g[f]);
        var i = {};
        var j;
        var k = 0;
        $.each(h, function(a, b) {
            if (j != b) {
                k = a;
                i[k] = 1
            } else i[k]++;
            j = b
        });
        $('tbody tr', this).each(function(c, d) {
            var e = 0;
            $('td', this).each(function(a, b) {
                if (a == f && c > 0) {
                    if (i[c - 1]) e = i[c - 1];
                    else e = 0;
                    if (e > 0) {
                        $(b).attr("rowspan", e)
                    } else {
                        $(b).hide()
                    }
                }
            })
        })
    };
    $.fn.setGridFlag = function(a, b) {
        if (a == -1) {
            var c = $(this).getDataIDs();
            for (var i = 0, len = c.length; i < len; i++) {
                $(this).jqGrid('setCell', c[i], "statusFlag", b)
            }
        } else {
            $(this).jqGrid('setCell', a, "statusFlag", b)
        }
    };
    $.fn.jqgridRowsStateColorChange = function(a) {
        var c = this;
        var e = $(c).jqGrid('getCell', a, "statusFlag");
        if (e == $.jqgridStatus.flag_delete) {
            c.find('tr#' + a).find('td[aria-describedby$=statusFlag]').css("color", "red")
        } else {
            c.find('tr#' + a).find('td[aria-describedby$=statusFlag]').css("color", "")
        }
    };
    $.fn.jqGridExcelExport = function(k) {
        $.ti.submitDynamicForm('downloadExcelForm', '/sample/excelDownAction.do', 'post', k)
    };
    $.fn.jqgridDataInfo = function(n, w, c) {
        var g = new Object();
        if (!w) {
            w = $(n).getGridParam("caption");
            if (w == bc) {
                w = "Sheet1"
            }
        }
        g.title = w.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "");
        var a = $(n)[0];
        var A = $.extend(true, [], a.p.data);
        var k = $.extend(true, [], a.p.colModel);
        var u = $.extend(true, [], a.p.colNames);
        var q = [];
        var j = [];
        var l = [];
        k = $.grep(k, function(i, B) {
            if ($.isArray(c)) {
                if (c.containsValue(i.name)) {
                    l.push(B);
                    return false
                }
            }
            return true
        });
        u = $.grep(u, function(B, i) {
            if ($.isArray(l)) {
                if (l.containsValue(i)) {
                    return false
                }
            }
            return true
        });
        $.each(k, function(C, B) {
            if (this["formatter"] == "select") {
                q.push(this["name"]);
                j.push(this["editoptions"].value)
            }
            if (this["formatoptions"]) {
                if (this["formatoptions"]["decimalPlaces"]) {
                    this["decimalPlaces"] = this["formatoptions"]["decimalPlaces"]
                }
            }
            if (this["template"]) {
                $.extend(true, this, this["template"] || {});
                delete this["template"]
            }
            delete this["edittype"];
            delete this["editoptions"];
            delete this["editrules"];
            delete this["formatoptions"];
            delete this["searchoptions"]
        });
        $.each(u, function(B, C) {
            u[B] = C.replace(/(<|<\;)br\s*\/*(>|>\;)/gi, "\n")
        });
        $.each(A, function(i, B) {
            delete this["rn"];
            delete this["cb"];
            $.each(B, function(C, F) {
                var D = $.inArray(C, q);
                if (D > -1) {
                    var E = j[D].split(";");
                    $.each(E, function(I, G) {
                        var H = G.split(":");
                        if (F == H[0]) {
                            A[i][C] = H[1]
                        }
                    })
                }
            })
        });
        g.colModel = k;
        g.colNames = u;
        g.data = A;
        return g
    }
})(jQuery, window, document);