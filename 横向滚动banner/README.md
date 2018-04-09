### Usage

依赖jquery

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
  <body>
    <section id="banner" class="banner-list-wpr">
      <ul class="banner-list" id="bannerList">
        <li>
          test1
        </li>
        <li>
          test2
        </li>
        <li>
          test3
        </li>
      </ul>
      <ul class="banner-list-ctrl" id="bannerCtrl">
        <li data-index="0">1</li>
        <li data-index="1">2</li>
        <li data-index="2">3</li>
      </ul>
    </section>
</html>
```

```css
#banner.banner-list-wpr {
    position: relative;
    padding: 0;
    background: none;
    overflow: hidden;
    ul {
        list-style: none;
        padding: 0;
    }
    .banner-list {
        overflow: hidden;
        li {
            float: left;
            height: 200px;
            padding: 0;
            text-align: center;
            line-height: 100px;
            color: #000;
        }
    }
    .banner-list-ctrl {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 10%;
        text-align: center;
        li {
            display: inline-block;

        }
    }
}
```

```javascript
let bannerBox = new HorizontalScroll(jQuery, {
    selector_wpr: '#banner',
    selector_list: '#bannerList',
    selector_item: '.banner-list li'
});
$('#bannerCtrl li').click(function() {
    bannerBox.goTo($(this).data('index'));
});
$('#banner').mouseover(function() {
    bannerBox.stop();
}).mouseout(function() {
    bannerBox.goOn();
});
```


