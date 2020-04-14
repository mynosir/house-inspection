$(function() {

    config = {
        apiServer: document.domain == 'dev.house-inspection.com' ? 'http://dev.house-inspection.com/' : 'https://house-inspection.kakaday.com/',
        resServer: document.domain == 'dev.house-inspection.com' ? 'http://dev.house-inspection.com/www/views/static/' : 'https://house-inspection.kakaday.com/www/views/static/'
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
                        alert('网络连接有问题，请检查网络！');
                    } else {
                        alert('系统繁忙，请稍后再试！');
                    }
                }
            })
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

});