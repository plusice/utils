//object的key不能带引号
function parseStrToObj(str){
    var objStr = str.replace(/\n|\s/g,'');
    var objStrArr =  objStr.split('');
    var stack = [];
    var obj = {};
    var curObj = obj;
    var arrOrObj = 'obj';
    var keyValReg = /([\d\D]+?):(\d+|[\'\"][\d\D]*[\'\"])/;//冒号前的匹配用非贪婪模式匹配，防止冒号后面再出现":8080"之类的
    for(var i = 1;i<objStrArr.length-1;i++){
        var curChart = objStrArr[i];
        switch (curChart){
            case ':':
                stack.push(curChart);
                break;
            case '{':
                leftFBracket(objStrArr[i-1],objStrArr[i+1]);
                break;
            case '}':
                rightFBracket(objStrArr[i-1],objStrArr[i+1]);
                break;
            case ',':
                comma(objStrArr[i-1],objStrArr[i+1]);
                break;
            case '[':
                leftSBracket(objStrArr[i-1],objStrArr[i+1]);
                break;
            case ']':
                rightSBracket(objStrArr[i-1],objStrArr[i+1]);
                break;
            case '"':

                
            case '\'':


            default:
                stack.push(curChart);
        }
    }
    return obj;
    // 左花括号
    function leftFBracket(prevChar,nextChar){
        var obj = {};//左括号，即将添加一个{}
        if(prevChar==':'){
            // 如果:是在引号里的，那就不做处理
            if(stack.indexOf('"')>0||stack.indexOf('\'')>0){
                return ;
            }
            //如果前面一个字符是":"，则这里新建一个{}，key名在stack中获取
            stack.pop();//将":"去除，得到key名
            obj._parent = curObj;//obj的_parent指向curObj，并将curObj指向obj
            curObj[''+stack.join('')+''] = obj;
            curObj = obj;
            stack = [];
        }else if(prevChar==','||prevChar=='['){
            // 如果前面一个字符是","或"["，则这里新建一个{}并push到数组中
            obj._parent = curObj;//obj的_parent指向curObj，并将curObj指向obj，
            curObj.push(obj);
            curObj = obj;
        }
    }
    // 右花括号
    function rightFBracket(prevChar,nextChar){
        if(prevChar=='"'||prevChar=='\''||/[^\{\}\[\]]/.test(prevChar)){
            //添加值
            var value = keyValReg.exec(stack.join(''));
            if(value){
                if(value[2].indexOf('"')==0||value[2].indexOf('\'')==0){
                    curObj[value[1]] = value[2].substr(1,value[2].length-2);
                }else{
                    curObj[value[1]] = value[2];
                }
            }else{
                curObj.push(stack.join(''));
            }
            // var value = stack.join('').split(':');
            // if(stack.indexOf(':')>0){
            //     curObj[value[0]] = value[1];
            // }else{
            //     curObj.push(value[0]);
            // }
            stack = [];
        }
        // 闭合，curObj指向父类，并把_parent删除
        var childObj = curObj;
        curObj = curObj._parent;
        delete(childObj['_parent']);
    }
    // 左方括号
    function leftSBracket(prevChar,nextChar){
        var obj = []//左括号，即将添加一个[]
        // 如果:是在引号里的，那就不做处理
        if(prevChar==':'){
            if(stack.indexOf('"')>0||stack.indexOf('\'')>0){
                return ;
            }
            stack.pop();//将":"去除，得到key名
            obj._parent = curObj;
            curObj[''+stack.join('')+''] = obj;
            curObj = obj;
            stack = [];
        }else if(prevChar==','||prevChar=='['){
            obj._parent = curObj;
            curObj.push(obj);
            curObj = obj;
        }
    }
    // 右方括号
    function rightSBracket(prevChar,nextChar){
        if(prevChar=='"'||prevChar=='\''||/[^\{\}\[\]]/.test(prevChar)){
            //添加值
            var value = keyValReg.exec(stack.join(''));
            if(value){
                if(value[2].indexOf('"')==0||value[2].indexOf('\'')==0){
                    curObj[value[1]] = value[2].substr(1,value[2].length-2);
                }else{
                    curObj[value[1]] = value[2];
                }
            }else{
                curObj.push(stack.join(''));
            }
            // var value = stack.join('').split(':');
            // if(stack.indexOf(':')>0){
            //     curObj[value[0]] = value[1];
            // }else{
            //     curObj.push(value[0]);
            // }
            stack = [];
        }
        // 闭合，curObj指向父类，并把_parent删除
        var childObj = curObj;
        curObj = curObj._parent;
        delete(childObj['_parent']);
    }
    // 逗号
    function comma(prevChar,nextChar){
        if(prevChar=='"'||prevChar=='\''||/[^\{\}\[\]]/.test(prevChar)){
            //添加值
            var value = keyValReg.exec(stack.join(''));
            if(value){
                if(value[2].indexOf('"')==0||value[2].indexOf('\'')==0){
                    curObj[value[1]] = value[2].substr(1,value[2].length-2);
                }else{
                    curObj[value[1]] = value[2];
                }
            }else{
                curObj.push(stack.join(''));
            }
            // var value = stack.join('').split(':');
            // if(stack.indexOf(':')>0){
            //     curObj[value[0]] = value[1];
            // }else{
            //     curObj.push(value[0]);
            // }
            stack = [];
        }
    }

}