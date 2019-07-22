// 给img标签src添加domain
str.replace(/<[img|IMG].*?src=[\'|\"](.*?(?:[\.jpg|\.jpeg|\.png|\.gif|\.bmp]))[\'|\"].*?[\/]?>/gi,
        function($0, $1) {
          return '<img src="' + domain + $1 + '" style="max-width:100%;height:auto">';
        })
