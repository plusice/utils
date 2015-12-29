
/**
 * Pagination depends on jquery,ejs,pagination plugin
 * @param {jquery object} $cntWpr      页面内容容器
 * @param {jquery object} $pgWpr       分页连接容器
 * @param {string}        templ        页面内容模板
 * @param {string}        requestName  数据请求url
 * @param {object}        pgConfig     分页配置:当前页,总页数,每页页数等
 */
Pagination = function (config) {
    this.$cntWpr = $(config.cntWprSelector);
    this.$pgWpr = $(config.pgWprSelector);
    this.templ = config.templ;
    this.emptyTip = config.emptyTip;
    this.requestName = config.requestName;
    this.pgConfig = config.pgConfig;
    this.init();
}
Pagination.prototype = {
    constructor: Pagination,
    init: function (pgConfig) {
        var self = this;
        self.getData({}, true);
    },
    /**
     * getData 获取数据并渲染内容
     * @param  {object}  params 请求参数
     * @param  {Boolean} isNew  是否需要更新分页
     */
    getData: function (params, isNew) {
        var that = this;
        var _params = $.extend(that.pgConfig,params);
        $.ajax(this.requestName,{
            dataType: 'json',
            data:_params,
            success: function (data) {
                that.refreshCnt(data);
                if (isNew) {
                    that.refreshPg(data);
                }
            }
        });
    },
    refreshCnt: function (data) {
        var html = ejs.render(this.templ, data);
        this.$cntWpr.empty().append(html);
    },
    refreshPg: function (data) {
        var that = this;
        this.$pgWpr.find('ul').pagination({
            items: data.pagination.total_item,
            itemsOnPage: data.pagination.per_page,
            currentPage: data.pagination.cur_page,
            cssStyle: 'pagination',
            prevText: '<<',
            nextText: '>>',
            onPageClick: function (page) {
                that.getData({
                    currentPage: page,
                });
            }
        });
    }
}
