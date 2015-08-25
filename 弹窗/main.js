// 弹窗
function JBDialog(config){
	// 渲染dialog的content，并添加类名
	this.$dialog = $(this.template(this.dialogHtml,config))
	this.$mask = $(this.maskHtml)
	this.$dialog.appendTo($('body'))
	this.$mask.appendTo($('body'))
	this.init(config)
}
JBDialog.prototype = {
	constructor:JBDialog,
	dialogHtml:'<div class="dialogWpr {{className}}" style="display:none">'
		            +'<div class="flexbox-center">'
		                +'<div class="dialogBox">'
		                    +'<p class="dialog-t"></p>'
		                    +'<div class="dialog-m dialogContent">'
		                    +'{{content}}'
		                    +'</div>'
		                    +'<p class="dialog-b dialogBtm">'
		                    +'</p>'
		                +'</div>'
		            +'</div>'
		        +'</div>',
	maskHtml:'<div class="dialogMask" style="display:none"></div>',
	template:function(temp, data){
		return temp.replace(/\{\{(.*?)\}\}/g, function($0,$1){
			return data[$1]
		});
	},
	init:function(config){
		var that = this
		var btnTemp = '<a href="javascript:;" class="dialogBtn dialog-btn {{className}}" btnindex="{{index}}">{{labelName}}</a>'
		var btnHtml = ''
		// 构造按钮html
		for (var max = config.btns.length,i = 0; i < max; i++) {
			btnHtml += this.template(btnTemp,$.extend(config.btns[i],{index:i}))
		}
		this.$dialog.find('.dialogBtm').append(btnHtml)
		// 绑定按钮回调函数
		this.$dialog.find('.dialogBtn').click(function(event){
			var cb = config.btns[$(this).attr('btnindex')].callback
			cb&&cb.call(that,{
				event:event
			})
		})
	},
	show:function(config){
		var height = $('html').height()
		var top = $(window).scrollTop()
		if(config&&config.content){
			this.$dialog.find('.dialogContent').empty().append(config.content)
		}
		this.$mask.css({
			'display':'block',
			'height':height
		})
		this.$dialog.css({
			'display':'block',
			'top':top
		})
	},
	hide:function(){
		this.$mask.css('display','none')
		this.$dialog.css('display','none')
	}
}
