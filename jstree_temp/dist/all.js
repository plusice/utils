"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TreeData = (function () {

    /**
     * @param  {object} treeData 构造树的数据
     * @param  {array} selected  已选择的数据
     */

    function TreeData(treeData, selected) {
        _classCallCheck(this, TreeData);

        this.treeData = treeData;
        this.selected = selected;
    }

    // selected添加item(s)

    _createClass(TreeData, [{
        key: "addItem",
        value: function addItem() {}

        // selected删除item(s)

    }, {
        key: "removeItem",
        value: function removeItem() {}

        // 根据，selected刷新treeData

    }, {
        key: "refreshTree",
        value: function refreshTree() {}
    }]);

    return TreeData;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TreeView = (function () {

    /**
     * @param  {string} selector 树容器选择器
     */

    function TreeView(selector) {
        _classCallCheck(this, TreeView);

        this.el = document.querySelector(selector);
    }

    _createClass(TreeView, [{
        key: "renderTree",
        value: function renderTree() {}
    }, {
        key: "spread",
        value: function spread() {}
    }, {
        key: "retract",
        value: function retract() {}
    }, {
        key: "select",
        value: function select() {}
    }]);

    return TreeView;
})();
//# sourceMappingURL=all.js.map
