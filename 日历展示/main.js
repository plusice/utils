var calendarViewBuilder = {
	buildMonth:function(opt){
		var sDate = opt.sDate,
			eDate = opt.eDate,
			curDate = sDate
		// 显示的天数
		var dayNum = eDate.getDate() - sDate.getDate() + 1
		var curDateNum = sDate.getDate()
		// startCol日期开始的列（星期几），startRow日期开始的行，endRow根据显示的天数进行计算
		// 这里不显示整个月份，所以row直接从0开始，endRow也是根据显示的天数进行计算
		var startCol = sDate.getDay(),
			startRow = 0
		var endCol = eDate.getDay(),
			endRow = Math.ceil((dayNum+startCol)/7)-1

		var tableHtml = '<table class="calTable"><tr class="calend-m-head"><td colspan="7">'+(sDate.getMonth()+1)+'月</td></tr></talbe><tr class="calend-m-weekday"><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';
		var $table = $(tableHtml)
		var $week = null
		var $dayTd = $('<td class="calendDay calend-m-day"></td>'),
			$tempDayTd = null
		for(var i = startRow;i <= endRow;i++){
			$week = $('<tr></tr>')
			for(var j = 0;j < 7;j++){
				// 当天若不在范围内，则不显示
				if((i==startRow&&j<startCol)||(i==endRow&&j>endCol)){
					$week.append($dayTd.clone())
				}else{
					curDate.setDate(curDateNum)
					// 添加周几的类
					$tempDayTd = $dayTd.clone().addClass('calend-m-day'+curDate.getDay())
					//存在渲染日期单元格的回调函数
					if(opt.renderDay){
						$week.append(opt.renderDay($tempDayTd,curDate))				
					}else{
						$week.append($tempDayTd.html(curDateNum))
					}
					curDateNum++
				}
			}
			$table.append($week)
		}

		return $table
	},
	buildDateToDate:function(opt){
		var $result = $('<div></div>')
		var sDate = opt.sDate,
			eDate = opt.eDate
		var cur_sDate = sDate,
			cur_eDate = eDate < getLastDateOfMonth(cur_sDate) ? eDate : getLastDateOfMonth(cur_sDate)

		while(true){
			$result.append(
				this.buildMonth({
					sDate:cur_sDate,
					eDate:cur_eDate,
					renderDay:opt.renderDay||null
				})
			)
			// 最终cur_eDate会等于eDate
			if(eDate.getTime()==cur_eDate.getTime()){
				break
			}
			cur_sDate = getFirstDateOfNext(cur_sDate)
			cur_eDate = eDate < getLastDateOfMonth(cur_sDate) ? eDate : getLastDateOfMonth(cur_sDate)
		}

		return $result

		// 获取本月最后一天
		function getLastDateOfMonth(date){
			return new Date(new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1000 * 60 * 60 * 24);
		}
		// 获取下一个月开始日期
		function getFirstDateOfNext(date){
			return new Date(new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime());
		}

	}
}