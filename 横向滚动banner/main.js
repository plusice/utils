// 依赖jquery
function HorizontalScroll($, opts) {
    let [
        $banner,
        $bannerList,
        $bannerItems,
        count,
        animationTimeout,
        rolling
    ] = [
        $(opts.selector_wpr),
        $(opts.selector_list),
        $(opts.selector_item),
        0,
        null,
        false
    ];
    let [
        bannerWidth,
        bannerLength
    ] = [
        $banner.width(),
        $bannerItems.length
    ];
    $bannerItems.width(bannerWidth);
    $bannerList.append($bannerItems.clone()).width(bannerLength * 2 + '00%');
    let interval = autoRoll();
    function autoRoll() {
        return setInterval(function() {
    
            count++;
        
            if (count === bannerLength + 1) {
                count = 1;
                $bannerList.find('li').slice(0, bannerLength)
                .appendTo($bannerList);
                $bannerList.css({
                    'margin-left': 0
                })
            }
        
            animationTimeout= setTimeout(function() {
                _rollTo(count);
            },100);
        
        }, 2000);
    };
    function stop() {
        clearTimeout(animationTimeout);
        clearInterval(interval);
    }
    function goOn() {
        interval = autoRoll();
    }
    function goTo(index, isGoOn) {
        if (rolling) {
            return false;
        }
        count = index || 0;
        stop();
        _rollTo(count);
        isGoOn && goOn();
    }
    function _rollTo(index) {
        rolling = true;
        $bannerList.animate({
            'margin-left': '-' + (index * 1) + '00%'
        }, 500, function() {
            rolling = false;
        });
    }
    return {
        stop: stop,
        goTo: goTo,
        goOn: goOn
    }
}
