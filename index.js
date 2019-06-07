// $(function () {
    // loading 
    function closes(dom) {
        dom.fadeOut("normal", function() {
            $(this).remove();
            // alert("数据加载完成");
        });
    }
    var loading;
    $.parser.onComplete = function () {
        if (loading) {
            clearTimeout(loading);
        }
        loading = setTimeout(closes($("#loading")), 1000);
    }
    var menuData = null;
    $.ajax({
        // url: 'http://127.0.0.1:5500/demo/src/data/menu.json',
        url: 'src/data/menu.json',
        dataType: 'json',
        type: 'get',
        async: false,
        contentType: 'application/json;charset=utf-8', 
        success: function(res){  
            // console.log(res.data); 
            menuData = res.data;
            menuData.forEach(function(item){
                getMenu(item);
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    })

    // 生成主菜单
    function getMenu(data) {
        var str = '';
        str += '<a id="menu_'+data.id+'" href="#" class="easyui-linkbutton" iconCls="'+data.iconCls+'" data-options="plain:true">'+data.text+'</a>'
        $('.easyui-panel').append(str)
        $.parser.parse($('.easyui-panel'))
    }

    var curData = [];
    var $menu_a = $('.easyui-panel').children('a');

    // 点击生成二级菜单
    $menu_a.on('click',function(e) {
        curData = [];
        var secondeMenu = null, itemData = [], secMenu = null; 

        var index = $menu_a.index(this);
        secMenu = menuData[index].child[0];
        // console.log(secMenu);
        secMenu.child.forEach(function(item){
            itemData.push({text:item.text})
        })
        // sideMenu 需要的数据
        secondeMenu = {
            text: secMenu.text,
            iconCls: 'icon-sum',
            // state: 'open',
            children: itemData
        }
        curData.push(secondeMenu);
        showSecMenu();   
    })

    // 显示二级菜单
    function showSecMenu() {
        $('.west').empty();
        var str = '';
        str += '<div id="sm" class="easyui-sidemenu" style="width:113px;" data-options="data:curData"></div>'
        // str += '<div id="sm" class="easyui-sidemenu" style="width:113px;" data-options="data:curData"></div>'
        $('.west').append(str);
        $.parser.parse($('.west'));
        var $li = $('.west').find('li');
        // console.log($li);
        // 二级菜单绑定事件有点乱，先按习惯写法，等待修改。。。
        // $('#tt').tabs({
        //     data: curData,
        //     onSelect: function() { 
        //         showContent();
        //     }
        // })
        $li.on('click', showContent);
    }

    function showContent(e) {
        // 二级菜单对应的内容
        console.log(e);
        // flag 判断是否需要加载动画，等待修改。。。
        var title = '', content, flag;
        var url = 'data/content.json';
        // console.log($(this).find('.tree-title').text());
        title = $(this).find('.tree-title').text();
        content = '<iframe scrolling="auto" frameborder="1" src="https://www.baidu.com" style="width:100%;height:1000px;"></iframe>';
        hasTabs();
        if(!flag) {
            var mark = '';
            mark = '<div class="content-mark"><img src="src/img/loading.gif"/><div>';
            $('#tt').append(mark);
            setTimeout(closes($(".content-mark")),5000);
        }

        function hasTabs() {
            // 判断标签是否打开过,且打开过的标签不需要加载动画
            if ($('#tt').tabs('exists', title)){
                $('#tt').tabs('select', title);
                flag = true;
            } else {
                $('#tt').tabs('add',{
                    title: title,
                    content: '<div style="padding:10px">'+content+'</div>',
                    closable: true
                }); 
                flag = false;
            }
            $('#tt').tabs('resize', {
                plain: false,
                boder: false,
                height: $(window).height()
            })
        }
    }
// })