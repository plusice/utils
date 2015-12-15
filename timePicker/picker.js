// pick time of serveral days
function WeekTime(opt) {

    this.$el = $(opt.el);
    this.template = opt.template;
    this.data = opt.data;
    this.init();

}
WeekTime.prototype = {
    constructor: WeekTime,
    init: function() {
        this.render();
        this.bindData();
    },
    render: function() {

        var $table = this.buildTable();
        this.$el.append($table);

    },
    buildTable: function() {

        var $table = $('<table></table>');
        var tableStr = [
            '<thead>',
                '<tr>',
                    '<th rowspan="2" class="col-day"></th>',
                    '<th colspan="7" class="col-times">凌晨时段</th>',
                    '<th colspan="4" class="col-times">上午时段</th>',
                    '<th colspan="4" class="col-times">中午时段</th>',
                    '<th colspan="4" class="col-times">下午时段</th>',
                    '<th colspan="5" class="col-times">夜晚时段</th>',
                '</tr><tr></tr>',
            '</thead>',
            '<tbody>',
            '</tbody>'
        ].join();
        $table.append(tableStr);
        var headStr = '',
            bodyStr = '';
        var days = this.data.days;

        // 时间段
        for (var i = 0; i < 24; i++) {
            headStr += '<th class="col-time">' + i + '</th>';
        }

        // 每天的时间选择
        for (var i = 0; i < days.length; i++) {
            bodyStr += '<tr class="rowDay row-day ' + days[i].className + '">'
                        + '<td>' + days[i].text + '</td>';
            for (var j = 0; j < 24; j++) {
                if (this.data.selected[i] != undefined && $.inArray(j, this.data.selected[i]) >= 0) {
                     bodyStr += '<td class="td-time tdTime active" data-index="' + i + ',' + j + '"></td>';
                } else {
                    bodyStr += '<td class="td-time tdTime" data-index="' + i + ',' + j + '"></td>';
                }
            }
            bodyStr += '</tr>';

        }

        $table.find('tr').eq(1).append(headStr);
        $table.find('tbody').append(bodyStr);
        return $table;

    },
    // 绑定各种事件
    bindData: function() {

        var self = this;

        this.$el.on('mousedown', '.tdTime', function() {

            var $this = $(this);
            var temp_startPoint = $this.data('index').split(',');
            self.dragging = true;
            // 类似data-index="1,1"
            self.startPoint = [+temp_startPoint[0], +temp_startPoint[1]];
            // $this.toggleClass('active');

            return false;

        });

        this.$el.on('mouseover', '.tdTime', function() {

            var temp_endPoint = $(this).data('index').split(',');
            if (self.dragging) {
                self.renderPoint(self.startPoint, [+temp_endPoint[0], +temp_endPoint[1]], true);
            } else {
                return false;
            }

        });

        this.$el.on('mouseup', '.tdTime', function() {

            var temp_endPoint = $(this).data('index').split(',');
            if (self.dragging) {
                self.renderPoint(self.startPoint, [+temp_endPoint[0], +temp_endPoint[1]], false);
            }
            self.dragging = false;
            return false;

        });

        $('body').mouseup(function (e) {
            if (self.dragging) {
                self.renderPoint(self.startPoint, self.startPoint, false);
                self.dragging = false;
            }
            return false;

        });

    },
    /**
     * 根据开始和结束坐标更改
     * @param  {array[num]} start 开始点的坐标，start[0]表示星期几，start[1]表示第几个时段
     * @param  {array[num]} end   结束点的坐标，end[0]表示星期几，end[1]表示第几个时段
     * @param  {bool} isTemp  是否时拖拽选择中
     */
    renderPoint: function (start, end, isTemp) {

        var _startDay = start[0] <= end[0] ? start[0] : end[0],
            _startTime = start[1] <= end[1] ? start[1] : end[1],
            _endDay = end[0] >= start[0] ? end[0] : start[0],
            _endTime = end[1] >= start[1] ? end[1] : start[1];

        var $td = this.$el.find('.tdTime');

        for (var i = 0; i <= 6; i++) {

            for (var j = 0; j <= 23; j++) {

                // 该点处在需要更改的坐标则更改，否则删除tempactive类，相当于画布清除重画
                if (i >= _startDay && i <= _endDay && j >= _startTime && j <= _endTime) {

                    // 如果是拖拽中，添加tempactive，否则删除tempactive，并且toggle类名active
                    if (isTemp) {
                        $td.eq(i*24 + j).addClass('tempactive');
                    } else {
                        $td.eq(i*24 + j).removeClass('tempactive').toggleClass('active');
                    }
                } else {
                    $td.eq(i*24 + j).removeClass('tempactive');
                }
            }

        }

        // 拖拽后更新数据
        if (!isTemp) {
            var selected = [];
            for (var i = 0; i < this.data.days.length; i++) {
                selected.push([]);
            }
            this.$el.find('.tdTime').each(function() {
                var $this = $(this);
                var day = -1,
                    time = -1,
                    index = [];
                //
                if ($this.hasClass('active')) {
                    index = $this.data('index').split(',');
                    day = +index[0];
                    time = +index[1];
                    if (selected[day] != undefined) {
                        selected[day].push(time);
                    } else {
                        selected[day] = [time];
                    }
                }

            });
            this.data.selected = selected;
            this.$el.trigger('updatetime');
        }
    },
    clearPoint: function() {
        this.$el.find('.tdTime').removeClass('tempactive active');
        this.data.selected = [];
        this.$el.trigger('updatetime');
    }
}
