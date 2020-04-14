$(function() {
    var page = {

        // 页面初始化方法
        init: function(p) {
            var self = this,
                json = {
                    api: config.apiServer + 'admin/get',
                    type: 'get',
                    data: {
                        actionxm: 'search',
                        page: !p ? 1 : p,
                        size: 20,
                        keywords: {
                            username: $('#username').val(),
                            realname: $('#realname').val(),
                            telephone: $('#telephone').val()
                        }
                    }
                };
            var callback = function(res) {
                if (res.status == 0) {
                    var list = res['data']['list'],
                        listTpl = '<tr><th>编号</th><th>账号</th><th>姓名</th><th>手机号码</th><th>Email</th><th>角色</th><th>超级管理员</th><th>操作</th></tr>';
                    for (var i in list) {
                        listTpl += '<tr>';
                        listTpl += '<td>' + list[i]['id'] + '</td>';
                        listTpl += '<td>' + list[i]['username'] + '</td>';
                        listTpl += '<td>' + list[i]['realname'] + '</td>';
                        listTpl += '<td>' + list[i]['telephone'] + '</td>';
                        listTpl += '<td>' + list[i]['email'] + '</td>';
                        listTpl += '<td>' + list[i]['rolename'] + '</td>';
                        var is_admin = '<span style="color: red;">否</span>';
                        if (list[i]['is_admin'] == 1) {
                            is_admin = '<span style="color: green;">是</span>';
                        }
                        listTpl += '<td>' + is_admin + '</td>';
                        listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_edit" data-toggle="modal" data-target="#editModal" data-id="' + list[i]['id'] + '">编辑</button>&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger js_delete" data-id="' + list[i]['id'] + '">删除</button></td>';
                        listTpl += '</tr>';
                    }
                    $('.js_table').html(listTpl);
                    // 处理分页
                    var pageTpl = '',
                        total = parseInt(res.data.total),
                        size = parseInt(res.data.size),
                        page = parseInt(res.data.page),
                        itemNum = Math.ceil(total / size),
                        itemStart = 1,
                        itemMax = 1,
                        fisrtItemCls = page == 1 ? ' class="disabled"' : '',
                        lastItemCls = page == itemNum ? ' class="disabled"' : '';
                    pageTpl += '<li ' + fisrtItemCls + '><a href="javascript:void(0)" aria-label="Previous" data-page="1" class="js_pageItem"><span aria-hidden="true">&laquo;</span></a></li>';
                    if (page > 3) {
                        itemStart = (page + 2) > itemNum ? itemNum - 4 : page - 2;
                        itemMax = (page + 2) > itemNum ? itemNum : page + 2;
                    } else {
                        itemMax = itemNum >= 5 ? 5 : itemNum;
                    }
                    for (itemStart; itemStart <= itemMax; itemStart++) {
                        var pageItemCls = itemStart == page ? ' class="active"' : '';
                        pageTpl += '<li ' + pageItemCls + '><a href="javascript:void(0)" data-page="' + itemStart + '" class="js_pageItem">' + itemStart + '</a></li>';
                    }
                    pageTpl += '<li ' + lastItemCls + '><a href="javascript:void(0)" aria-label="Next" data-page="' + itemNum + '" class="js_pageItem"><span aria-hidden="true">&raquo;</span></a></li>';
                    $('.js_page').html(pageTpl);
                } else {
                    alert(res.msg);
                }
            };
            json.callback = callback;
            Utils.requestData(json);
            self.getRoleList();
        },

        getRoleList: function() {
            var self = this,
                json = {
                    api: config.apiServer + 'role/get',
                    type: 'get',
                    data: {
                        actionxm: 'getList'
                    }
                };
            var callback = function(res) {
                if (res.status == 0) {
                    var list = res.data;
                    var listTpl = '<option value="0">/</option>';
                    for (var i in list) {
                        listTpl += '<option value="' + list[i]['id'] + '">' + list[i]['name'] + '</span></option>';
                    }
                    $('.js_add_role_id').html(listTpl);
                    $('.js_update_role_id').html(listTpl);
                } else {
                    alert(res.msg);
                }
            };
            json.callback = callback;
            Utils.requestData(json);
        },

        deleteConfirmTip: function(id) {
            $('#confirmModal').find('.js_sure_delete').attr('data-id', id);
            $('#confirmModal').modal('show');
        },

        deletItem: function(id) {
            var json = {
                api: config.apiServer + 'admin/post',
                type: 'post',
                data: {
                    actionxm: 'delete',
                    id: id
                }
            };
            var callback = function(res) {
                $('#confirmModal').modal('hide');
                alert(res.msg);
                window.location.reload();
            };
            json.callback = callback;
            Utils.requestData(json);
        },

        getDetail: function(id) {
            var json = {
                api: config.apiServer + 'admin/get',
                type: 'get',
                data: {
                    actionxm: 'detail',
                    id: !id ? 1 : id
                }
            };
            var callback = function(res) {
                if (res.status == 0) {
                    $('.js_update_id').val(res['data'].id);
                    $('.js_update_username').html(res['data'].username);
                    $('.js_update_password').val(res['data'].password);
                    $('.js_update_realname').val(res['data'].realname);
                    $('.js_update_telephone').val(res['data'].telephone);
                    $('.js_update_email').val(res['data'].email);
                    $('.js_update_role_id').val(res['data'].role_id);
                    $("input[class='js_update_is_admin'][value='" + res['data'].is_admin + "']").prop('checked', 'checked');
                } else {
                    alert('系统异常！');
                }
            };
            json.callback = callback;
            Utils.requestData(json);
        }

    };

    $('.js_searchFrom').submit(function(e) {
        e.preventDefault();
        var p = $('.js_page li[class=active] a').data('page');
        page.init(p);
    });

    $('body').delegate('.js_delete', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        page.deleteConfirmTip(id);
    });

    $('body').delegate('.js_sure_delete', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        page.deletItem(id);
    });

    $('body').delegate('.js_add_saveBtn', 'click', function() {
        var username = $('.js_add_username').val(),
            password = $('.js_add_password').val(),
            realname = $('.js_add_realname').val(),
            telephone = $('.js_add_telephone').val(),
            email = $('.js_add_email').val(),
            role_id = $('.js_add_role_id').val(),
            is_admin = $("input[class='js_add_is_admin']:checked").val();
        var json = {
            api: config.apiServer + 'admin/post',
            type: 'post',
            data: {
                actionxm: 'add',
                params: {
                    username: username,
                    password: password,
                    realname: realname,
                    telephone: telephone,
                    email: email,
                    role_id: role_id,
                    is_admin: is_admin
                }
            }
        };
        var callback = function(res) {
            alert(res.msg);
            if (res.status == 0) {
                $('#addModal').modal('hide');
                window.location.reload();
            }
        };
        json.callback = callback;
        Utils.requestData(json);
    });

    $('body').delegate('.js_pageItem', 'click', function(e) {
        var p = $(e.currentTarget).data('page');
        page.init(p);
    });

    $('body').delegate('.js_saveBtn', 'click', function() {
        var id = $('.js_update_id').val(),
            password = $('.js_update_password').val(),
            realname = $('.js_update_realname').val(),
            telephone = $('.js_update_telephone').val(),
            email = $('.js_update_email').val(),
            role_id = $('.js_update_role_id').val(),
            is_admin = $("input[class='js_update_is_admin']:checked").val();
        var json = {
            api: config.apiServer + 'admin/post',
            type: 'post',
            data: {
                actionxm: 'update',
                id: id,
                params: {
                    password: password,
                    realname: realname,
                    telephone: telephone,
                    email: email,
                    role_id: role_id,
                    is_admin: is_admin
                }
            }
        };
        var callback = function(res) {
            alert(res.msg);
            if (res.status == 0) {
                $('#editModal').modal('hide');
                window.location.reload();
            }
        };
        json.callback = callback;
        Utils.requestData(json);
    });

    $('body').delegate('.js_edit', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        page.getDetail(id);
    });

    page.init();
});