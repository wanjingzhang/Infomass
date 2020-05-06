var tableTree = function () {
    var tableH = document.getElementById("tableH");
    var cFilter = document.getElementById("filterC");
    // var tableC = document.getElementById("tableC"); 
    var startType, endType;
    // 有三种状态，A 为filters B 为table Header，A->B, B->A, B->B
    var flag = false;
    var headers = [];
    var filters = [];
    var firstTime = 0;
    var lastTime = 0;
 
    /***
     * 鼠标按下
     */
    function itemMouseDown(eMouseDown) {
        // console.log("itemMouseDown"); 
        var startIndex = $(this).data("id");
        var endIndex;
        // 鼠标按下时获取当前的类型
        startType = $(this).data("type");
        if(startType == "filter"){
            firstTime = new Date().getTime();
        }
        // 状态3 B内元素的拖动  
        flag = true; 
        $('#info').html($(this).html()); 
        $(document).mousemove(function (e) {
            // console.log("doc.mouseMove");
            if (flag) {
                $('#info').css({
                    display: 'block'
                });
                
                var e = e || window.event;
                var x = e.clientX + 15 + 'px';
                var y = e.clientY + 15 + 'px';
                $('#info').css({
                    left: x,
                    top: y
                });
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            }
        });
        // 拖动到表头div 即触发元素交换 B->B
        $('#tableH div').mouseenter(function () {
            // console.log("tableH div mouseEnter");
            if (startType == "header") {
                endIndex = $(this).index();
            } else if (startType == "filter") {
                endIndex = $(this).index();
            }
            endType = $(this).data("type");

            $('#triangle').css('display', 'block');
            var offsetW = 0;
            var preTd = $(this).prevAll();
            $.each(preTd, function (id, item) {
                offsetW += item.offsetWidth;
            })
            // 元素内移动 B->B
            if (startType == "header" && endType == "header") {
                if (endIndex > startIndex) {
                    offsetW += $(this)["0"].offsetWidth;
                }
            } else if (startType == "filter" && endType == "header") {
                console.log("endIndex=" + endIndex);
            }

            $('#triangle').css({
                'top': $(cFilter).innerHeight() + 10,
                'left': offsetW + 14
            });
        });
        // 拖动到过滤器 即触发 B-> A 把header里的数据元素存放在A
        $('#filterC').mouseenter(function () {
            // console.log("filterC mouseEnter");
            endType = "filter";
            // 追加到A最后 
        })
        $('#tableH').mouseenter(function () {
            endType = "header";
        })
        // 交换元素
        $(document).mouseup(function (e) {
            lastTime = new Date().getTime(); 
            /**
             * 单击元素排序
             */   
            if( (lastTime - firstTime) < 100 && startType == "filter"){  
                filters[startIndex].sort = (filters[startIndex].sort == "asc" ? "desc":"asc"); 
            }
            // console.log("doc.mouseUp");
            flag = false;
            // console.log("startIndex=" + startIndex + "endIndex=" + endIndex); 
            // B->B 第三种B内的移动
            if (startType == endType && startType == "header") {
                if (endIndex > startIndex) {
                    headers.splice(endIndex, 0, headers.splice(startIndex, 1)[0]);
                } else {
                    headers.splice(endIndex, 0, headers.splice(startIndex, 1)[0]);
                } 
                // B->A 第二种移动 
            } else if (startType == "header" && endType == "filter") {
                filters.push(headers.splice(startIndex, 1)[0]);
                // A->B 第一种移动
            } else if (startType == "filter" && endType == "header") {
                headers.splice(endIndex, 0, filters.splice(startIndex, 1)[0]);
            }

            $('div.item').unbind("mousedown");
            initDisplay(headers, filters);

            $('#triangle').css({ 'display': 'none' });
            $('#info').css({ 'display': 'none' });

            // 表头拖动事件 
            $(document).unbind("mousemove");
            $(document).unbind("mouseup");
            $('#tableH div').unbind("mouseenter");
        });
    }

    /**
     * 初始化表头显示数据
     * @param {*} h 表头元素
     * @param {*} f 过滤元素
     */
    function initDisplay(h, f) { 
        var str = "";
        headers = h;
        var total = 100;
        var itemWid = Math.floor(100/ headers.length);
        for (var i = 0; i < headers.length; i++) {
            if(i < headers.length -1 ){
                total -= itemWid;
            }else if(i == headers.length -1){
                itemWid = total;
            } 
            str += "<div class='item' id='" + headers[i].key + "' data-type='header' data-id='" + i + "' draggable='true' style='width:"+ itemWid +"%'>" + headers[i].value + "</div>"
        }
        tableH.innerHTML = str;
        // 初始化过滤器
        str = "";
        filters = f;
        
        for (var i = 0; i < filters.length; i++) {
            str += "<div class='item "+ filters[i].sort +"' id='" + filters[i].key + "' data-type='filter' data-id='" + i + "' draggable='true' >" + filters[i].value + "</div>"
        }
        cFilter.innerHTML = str;

        // for(var i = 0; i > vTableData.data.length; i++){
        //     str += "<div>"
        //     for(var j in vTableData.data[i]){
        //         str += "";
        //     }
        //     str += "</div>"
        // }
        // tableC.innerHTML = str;

        // 表头拖动事件
        $('div.item').mousedown(itemMouseDown); 
    }

    /** 初始化数据 */
    function initHeader() {
        initDisplay(vTableData.tableHeader, vTableData.filters);

        // 初始化arrow的位置
        var h = $('#tableH .item:nth-child(1)').outerHeight();
        $('.arrow-up').css({
            'margin-top': h
        });
    }

    return {
        initHeader: initHeader
    }
}

tableTree().initHeader();