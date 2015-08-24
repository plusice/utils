/**
 * LocalModule localstorage存储运行js
 * @param {str|array[str]} modules js文件url或url数组
 */
var LocalModule = function (modules) {
    this.loadIndex = -1;
    // 将要加载的文件url数组
    this.urls = modules instanceof Array ? modules : [modules];
    // 模块数组,包含状态,url,版本号和脚本内容
    this.modules = [];
    for (var i = 0, len = this.urls.length; i < len; i++) {
        var urlArr = this.urls[i].split('?');
        this.urls[i] = urlArr[0];
        this.modules.push({
            status: 'unloaded',
            url: this.urls[i],
            version: urlArr[1] || '',
            script: ''
        });
    };
};
LocalModule.prototype = {
    constructor: LocalModule,
    /**
     * loadModules 通过ajax或者localstorage加载LocalModule.urls数组中所有js文件url
     */
    loadModules: function () {
        var self = this;
        var loadIndex = ++self.loadIndex,
            url = self.urls[loadIndex];

        // 如果数组为空,则退出加载,否则继续加载LocalModule.urls
        if (url === undefined) {
            return false;
        }

        // localStorage中不存在文件内容或者版本号不一致,则加载,否则直接执行localStorage的脚本
        if ((!localStorage[url] || localStorage[url+'-v'] != self.modules[loadIndex].version) || (!window.localStorage)) {
            var req = getXmlHttpRequestObject();
            req.open("GET", url, true);
            req.send();
            req.onreadystatechange = function() {
                if (req.readyState == 4) {

                    // 防止隐身浏览等不支持localStorage情况报错
                    try {
                        localStorage[url] = req.responseText;
                        localStorage[url+'-v'] = self.modules[loadIndex].version;
                    } catch (e) {
                        // console.log('localStorage error');
                    }

                    self.execScript(url, req.responseText);

                }
            };
        } else {
            self.execScript(url, localStorage[url]);
        }

        self.loadModules();

        function getXmlHttpRequestObject() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else if(window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
    },
    /**
     * [execScript 改变当前模块脚本状态并存储,若之前模块未加载完成,则结束,否则从当前模块开始向后执行已加载完成的模块]
     * @param  {string} url    [模块url]
     * @param  {string} script [模块脚本]
     */
    execScript: function (url, script) {
        var index = -1,
            modules = this.modules;
        var isPreReady = true;

        // 获取当前模块索引,并判断之前的所有模块是否都已加载完毕
        for (var i = 0,len = modules.length; i < len; i++) {
            if (modules[i].url == url) {
                index = i;
                break;
            }
            if (modules[i].status != 'loaded') {
                isPreReady = false;
            }
        };

        // 设置当前模块状态,存储当前模块脚本(浏览器可能不支持localstorage)
        modules[index].status = 'loaded';
        modules[index].script = script;

        // 如果之前模块已加载完成,则从当前模块开始向后执行所有已加载完成的模块
        if (isPreReady || index == 0) {
            while (modules[index] && modules[index].status == 'loaded') {
                evalGlobal(modules[index].script);
                index++;
            }
        }

        function evalGlobal(strScript){
            var script = document.createElement("script" );
            script.type= "text/javascript";
            script.text= strScript ;
            document.getElementsByTagName("body")[0].appendChild(script) ;
        }
    }
};
