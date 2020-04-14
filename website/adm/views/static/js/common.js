$(function() {
    config = {
        apiServer: document.domain == 'dev.house-inspection.com' ? 'http://dev.house-inspection.com/adm/' : 'https://house-inspection.kakaday.com/adm/',
        resServer: document.domain == 'dev.house-inspection.com' ? 'http://dev.house-inspection.com/adm/views/static/' : 'https://house-inspection.kakaday.comn/adm/views/static/'
    };
    Utils = {
        // 请求数据公用方法
        requestData: function(json) {
            $.ajax({
                url: json.api,
                type: json.type,
                dataType: 'json',
                data: json.data,
                timeout: 30000,
                success: function(data) {
                    json.callback(data);
                },
                error: function(xhr, errorType, error) {
                    if (!navigator.onLine || errorType === 'timeout') {
                        $('.alert-error').text('网络连接有问题，请检查网络').show();
                        setTimeout("$('.alert').hide()", 3000);
                    } else {
                        $('.alert-error').text('后台有问题，请联系管理员').show();
                        setTimeout("$('.alert').hide()", 3000);
                    }
                }
            })
        },
        // 初始化菜单
        initMenu: function(c) {
            var item = $('.sidebar li[class*=' + c + ']');
            $('.sidebar li').removeClass('active');
            item.addClass('active');
        },
        // 初始化子菜单
        initSubMenu: function(c) {
            if ($('.js_sub_menu li').length <= 0) return;
            var item = $('.js_sub_menu li[class*=' + c + ']');
            $('.js_sub_menu li').removeClass('active');
            item.addClass('active');
        },
        // 获取地址栏参数
        GetQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }
    };
    $('.js_logout').on('click', function() {
        var json = {
            api: config.apiServer + 'login/post',
            type: 'post',
            data: {
                actionxm: 'logout'
            }
        };
        var callback = function(res) {
            if (res.status == 0) {
                $('.alert-success').text(res.msg).show();
                window.location.href = '/adm/login';
            } else {
                $('.alert-danger').text(res.msg).show();
            }
            setTimeout("$('.alert').hide()", 3000);
        };
        var errorCall = function() {
            $('.alert-warning').text('系统繁忙，请稍后再试').show();
            setTimeout("$('.alert').hide()", 3000);
        };
        json.callback = callback;
        json.errorCall = errorCall;
        Utils.requestData(json);
    });

    Utils.initMenu(window.current_menu);
    Utils.initSubMenu(window.current_sub_menu);
});