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

    // $(document).ready(function() {
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
	// })

    var curData = null;
    $menu = $('.menu-panel');
    var $menu_a = $menu.children('a');

    // 生成主菜单
    function getMenu(data) {
        var str = '';
        str += '<a id="menu_'+data.id+'" href="javascript:;" class="menu-btn easyui-linkbutton" iconCls="'+data.iconCls+'" data-options="plain:true">'+data.text+'</a>'
        $('.easyui-panel').append(str)
        $.parser.parse($('.easyui-panel'))
		createSecMenu();
    }
	function createSecMenu(index) {
		index = index || 0;
		
		curData = [];
        var secondeMenu = null, itemData = [], secMenu = null;

        secMenu = menuData[index].child[0];
        // console.log(secMenu);
        secMenu.child.forEach(function(item){
            itemData.push({text:item.text})
        })
        // sideMenu 需要的数据
        secondeMenu = {
            text: secMenu.text,
            iconCls: 'icon-sum',
            state: 'open',
            children: itemData
        }
        curData.push(secondeMenu);
		showSecMenu();
	}
    // 点击生成二级菜单
    $menu_a.on('click',function(e) {
		// console.log(1);
        var index = $menu_a.index(this);
		createSecMenu(index);
    })

    // 显示二级菜单
    function showSecMenu() {
        $('#sm').sidemenu({
			data: curData,
            onSelect: function(item) {
                showContent(item);
            }
        });
		$.parser.parse($('#sm'));
    };

    function showContent(item) {
        // 二级菜单对应的内容
        var title = '';
        title = item.text;
        hasTabs(title);

        function hasTabs(title) {
            // 判断标签是否打开过,打开过的标签不需要加载动画
            if ($('#tt').tabs('exists', title)){
                $('#tt').tabs('select', title);
            } else {
                $('#tt').tabs('add',{
                    // 面板的属性
                    title: title,
                    href: './pages/datagrid.html',
                    closable: true,
                    // content: '<div style="padding:10px">'+content+'</div>',
                    closable: true
                });
            }
        }
    }
// })
