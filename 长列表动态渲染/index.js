
new Vue({
  el: '#demo',

  data: function() {
    var testList = Array.apply(null, Array(30)).map(function(item,index) {return index;});
    var cacheItemNum = 2;
    var fullItemNum = 10;

    return {
      testList: testList,
      showedList: testList.slice(0,fullItemNum + cacheItemNum*2), // fullItemNum个item可以占满容器，上下再各存两个，以实现滚动效果
      lastScrollTop: 0,
      listTop: 0,
      itemHeight: 20,
      fullItemNum: fullItemNum,
      cacheItemNum: cacheItemNum
    }
  },

  methods: {
    onScroll:function (e) {
      // 当滚动高度超过两个item时，需要更新showedList
      if (Math.abs(e.target.scrollTop - this.lastScrollTop) > this.cacheItemNum * this.itemHeight) {
        var cacheItemHeight = this.cacheItemNum * this.itemHeight;
        // 如果滚动的高度超过上面两个元素的高度，则根据两者之差计算出开始显示的索引
        // 否则索引为0
        var showedStart = (e.target.scrollTop - cacheItemHeight) >= 0 ? Math.floor((e.target.scrollTop - cacheItemHeight)/this.itemHeight): 0;
        this.showedList = this.testList.slice(showedStart, showedStart + this.fullItemNum + this.cacheItemNum*2);
        // 如果索引为0，列表上面没有元素了，则列表top为0
        // 否则top为没有显示的列表的总高度
        this.listTop = showedStart === 0 ? 0 : Math.floor(e.target.scrollTop/this.itemHeight)*this.itemHeight - cacheItemHeight;
        // 更新旧的scrolltop
        this.lastScrollTop = e.target.scrollTop;
      }
    }
  }

});