$(function() {
    var page = {
        init: function() {
        }
    };
    page.init();

    $('body').delegate('.js_saveBtn', 'click', function() {
        var password_old = $('.js_password_old').val(),
            password_new = $('.js_password_new').val().trim(),
            password_new1 = $('.js_password_new1').val().trim();
        if(password_new != password_new1) {
            alert('The two passwords you typed do not match. ');
            return;
        }
        var json = {
            api: config.apiServer + 'admin/post',
            type: 'post',
            data: {
                actionxm: 'changePwd',
                password_old: password_old,
                password_new: password_new
            }
        };
        var callback = function(res) {
            alert(res.msg);
            if(res.status==0) {
                $('#editModal').modal('hide');
                window.location.reload();
            }
        };
        json.callback = callback;
        Utils.requestData(json);
    });
});
