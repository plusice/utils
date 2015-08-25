#####使用:

    // jquery/zepto required
    var test = new JBDialog({
        className: 'classTest',
        content: 'content',
        btns:[
            {
                className: 'test',
                labelName: 'confirm',
                callback: function(){
                    console.log(1);
                }
            }
        ]
    });

    test.show({
        content:'dynamic content'
    })

