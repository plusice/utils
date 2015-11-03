#####说明:

    example of build.xml to build front-end project by ant

#####build.xml文件目录下执行```ant```命令,默认会执行:

1. 编译sass文件至```css/style.css```.单独执行此任务可执行:```ant css```
2. 根据index.html的script标签对js文件进行合并压缩,并相应更改/添加index.html的js引用.单独执行此任务可执行:```ant js```
3. 编译```views/**/*.haml```文件为同目录下的html文件,压缩html,并将html转换成js文件(在页面执行时作为templateCache注入).单独执行此任务可执行:```ant html```.注意编译haml文件后,index.html的内容会被覆盖,js的引用会被还原.
4. 添加manifest文件,对指定的文件进行缓存(文件列表可在cachefile任务中查看),当git版本号改变时会改变manifest文件

*js处理任务依赖patch任务,patch任务会给angular源码进行修改*

#####index.haml中javascript的引用规则如下:

    / build:js/lib.js
    %script(src='/js/d1/test1.js')
    %script(src='/js/d1/test2.js')
    / js/lib.js:build

    / templatejs

    / build:js/app.js
    %script(src='/js/d2/test3.js')
    %script(src='/js/d2/test4.js')
    / js/app.js:build

    /test:js
    %script(src='/js/d2/test5.js')
    /endtest

1. 需要进行合并压缩的文件写在build:xxx/xxx.js和xxx/xxx.js:build两个注释中间,且每个script标签间必须换行.上面内容将会把test1.js,test2.js文件合并至```js/lib.js```,把test3.js,test4.js文件合并至```js/app.js```.
2. templatejs注释将被替换成angular的模板文件引用(模板文件在构建时从html文件转换而来),模板引用需放在angular和业务代码的引用之间.
3. test:js和endtest之间的脚本引用将被删除

上面将把index.html的引用替换为:

    <script src='/js/lib.js'></script>
    <script src='/js/templatejs.min.js'></script>
    <script src='/js/app.js'></script>
