$(function() {
    var page = {

        // 页面初始化方法
        init: function() {
            var self = this,
                json = {
                    api: config.apiServer + 'menu/get',
                    type: 'get',
                    data: {
                        actionxm: 'search'
                    }
                };
            var callback = function(res) {
                if (res.status == 0) {
                    var idx = 1,
                        list = res['data'],
                        listTpl = '<tr><th style="width:82px">编号</th><th style="width:120px">菜单名称</th><th>控制器</th><th>排序</th><th>标志</th><th>创建用户</th><th>创建时间</th><th>更新用户</th><th>更新时间</th><th style="width:140px">操作</th></tr>';
                    for (var i in list) {
                        listTpl += '<tr>';
                        listTpl += '<td>' + (idx++) + '</td>';
                        if (list[i]['level'] > 0) {
                            listTpl += '<td><span style="display: inline-block; padding-left: ' + (20 * list[i]['level']) + 'px">|--' + list[i]['name'] + '</span></td>';
                        } else {
                            listTpl += '<td>' + list[i]['name'] + '</td>';
                        }
                        listTpl += '<td>' + list[i]['ctrl_name'] + '</td>';
                        listTpl += '<td>' + list[i]['sort'] + '</td>';
                        listTpl += '<td>' + list[i]['mark'] + '</td>';
                        listTpl += '<td>' + list[i]['create_user'] + '</td>';
                        listTpl += '<td>' + list[i]['create_time'] + '</td>';
                        listTpl += '<td>' + list[i]['update_user'] + '</td>';
                        listTpl += '<td>' + list[i]['update_time'] + '</td>';
                        listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_edit" data-toggle="modal" data-target="#editModal" data-id="' + list[i]['id'] + '">编辑</button>&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger js_delete" data-id="' + list[i]['id'] + '">删除</button></td>';
                        listTpl += '</tr>';
                    }
                    $('.js_table').html(listTpl);
                    // 渲染编辑菜单的选项
                    self.renderMenuTree(list);
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
                api: config.apiServer + 'menu/post',
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

        renderMenuTree: function(list) {
            var listTpl = '<option value="0">/</option>';
            for (var i in list) {
                var prefix = '';
                while (list[i]['level'] >= 0) {
                    prefix += '|--';
                    list[i]['level']--;
                }
                listTpl += '<option value="' + list[i]['id'] + '">' + prefix + list[i]['name'] + '</span></option>';
            }
            $('.js_add_menuTree').html(listTpl);
            $('.js_update_menuTree').html(listTpl);
        },

        getDetail: function(id) {
            var json = {
                api: config.apiServer + 'menu/get',
                type: 'get',
                data: {
                    actionxm: 'detail',
                    id: !id ? 1 : id
                }
            };
            var callback = function(res) {
                if (res.status == 0) {
                    $('.js_update_id').val(res['data'].id);
                    $('.js_update_name').val(res['data'].name);
                    $('.js_update_ctrl_name').val(res['data'].ctrl_name);
                    $('.js_update_menuTree').val(res['data'].pid);
                    $('.js_update_sort').val(res['data'].sort);
                    $('.js_update_mark').val(res['data'].mark);
                } else {
                    alert('系统异常！');
                }
            };
            json.callback = callback;
            Utils.requestData(json);
        }

    };


    $('body').delegate('.js_delete', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        page.deleteConfirmTip(id);
    });

    $('body').delegate('.js_sure_delete', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        page.deletItem(id);
    });

    $('body').delegate('.js_add_saveBtn', 'click', function() {
        var name = $('.js_add_name').val(),
            ctrl_name = $('.js_add_ctrl_name').val(),
            pid = $('.js_add_menuTree').val(),
            sort = $('.js_add_sort').val(),
            mark = $('.js_add_mark').val();
        var json = {
            api: config.apiServer + 'menu/post',
            type: 'post',
            data: {
                actionxm: 'add',
                params: {
                    name: name,
                    ctrl_name: ctrl_name,
                    pid: pid,
                    sort: sort,
                    mark: mark
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

    $('body').delegate('.js_saveBtn', 'click', function() {
        var id = $('.js_update_id').val(),
            name = $('.js_update_name').val(),
            ctrl_name = $('.js_update_ctrl_name').val(),
            pid = $('.js_update_menuTree').val(),
            sort = $('.js_update_sort').val(),
            mark = $('.js_update_mark').val();
        var json = {
            api: config.apiServer + 'menu/post',
            type: 'post',
            data: {
                actionxm: 'update',
                id: id,
                params: {
                    name: name,
                    ctrl_name: ctrl_name,
                    pid: pid,
                    sort: sort,
                    mark: mark
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