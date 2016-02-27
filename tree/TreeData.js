class TreeData {

    /**
     * @param  {object} treeData 构造树的数据
     * @param  {array} selected  已选择的数据
     */
    constructor(treeData, selected) {
        this.treeData = treeData;
        this.selected = selected;
    }

    // selected添加item(s)
    addItem() {

    }

    // selected删除item(s)
    removeItem() {

    }

    // 根据，selected刷新treeData
    refreshTree() {

    }

}


/**
 * 给树添加seleted属性
 * @param  {object} node        树节点,node的id和selectedArr元素必须是同类型数据,不要一个string一个number
 * @param  {array} selectedArr  已选的id数组
 */
function adaptNodeData(node, selectedArr) {

    var list = node.child;
    var isAll = true,
        isOne = false;

    if (list) {
        for (var i = 0, max = list.length; i < max; i++ ) {

            adaptNodeData(list[i], selectedArr);

            if (list[i].seleted) {
                isOne = true;
            }
            if (list[i].seleted == 'has' || !list[i].seleted ) {
                isAll = false;
            }

        }

        if (isOne) {
            node.seleted = 'has';
        }
        if (isAll) {
            node.seleted = 'all';
        }
        if (!isOne && !isAll) {
            node.seleted = false;
        }


    } else {
        if ($.inArray(node.id, selectedArr) >= 0 || selectedArr == 0) {
            node.seleted = true;
        } else {
            node.seleted = false;
        }
    }
}
