//倒计时
var countDown = (function(){
	//时间日期小于10前面的加0
	function datePlusZero(num) {
		if (num < 10) num = '0' + num;
		return num;
	}
	// 剩余毫秒数初始化，已经初始化开始读秒
	function _init(leftTime){
		var self = this
		self.leftTime = leftTime
		self.interval = setInterval(function(){
			var s = datePlusZero(parseInt(self.leftTime / 1000 % 60))
			var m = datePlusZero(parseInt(self.leftTime / (60 * 1000) % 60))
			var h = datePlusZero(parseInt(self.leftTime / (60 * 60 * 1000) % 24))
			var d = datePlusZero(parseInt(self.leftTime / (24 * 60 * 60 * 1000)))
			// 触发监听
			for(var i in self.listeners){
				if(self.listeners[i]){
					self.listeners[i]({
						sec:s,
						min:m,
						hour:h,
						day:d,
						total:self.leftTime
					})
				}
			}
			if(self.leftTime == 0){
				clearInterval(self.interval)
				self.interval = null
			}else{
				self.leftTime -= 1000	
			}
		},1000)
	}
	// 添加侦听器，会在读秒的时候触发
	function _addTimeListener(name,fun){
		this.listeners[name] = fun
	}
	function _removeTimeListener(name){
		this.listeners[name] = null
	}
	return {
		leftTime:0,
		init:_init,
		listeners:{},
		addTimeListener:_addTimeListener,
		removeTimeListener:_removeTimeListener
	}
})()
countDown.init(3600000)