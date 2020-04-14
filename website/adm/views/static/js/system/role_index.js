$(function() {
    var page = {

        // 页面初始化方法
        init: function(p) {
            var self = this,
                json = {
                    api: config.apiServer + 'role/get',
                    type: 'get',
                    data: {
                        actionxm: 'search',
                        page: !p ? 1 : p,
                        size: 20
                    }
                };
            var callback = function(res) {
                if (res.status == 0) {
                    var list = res['data']['list'],
                        listTpl = '<tr><th>编号</th><th>名称</th><th>菜单权限</th><th>创建用户</th><th>创建时间</th><th>更新用户</th><th>更新时间</th><th>操作</th></tr>';
                    for (var i in list) {
                        listTpl += '<tr>';
                        listTpl += '<td>' + list[i]['id'] + '</td>';
                        listTpl += '<td>' + list[i]['name'] + '</td>';
                        listTpl += '<td>' + list[i]['pms_name'] + '</td>';
                        listTpl += '<td>' + list[i]['create_user'] + '</td>';
                        listTpl += '<td>' + list[i]['create_time'] + '</td>';
                        listTpl += '<td>' + list[i]['update_user'] + '</td>';
                        listTpl += '<td>' + list[i]['update_time'] + '</td>';
                        listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_edit" data-id="' + list[i]['id'] + '">编辑</button>&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger js_delete" data-id="' + list[i]['id'] + '">删除</button></td>';
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
        },

        deleteConfirmTip: function(id) {
            $('#confirmModal').find('.js_sure_delete').attr('data-id', id);
            $('#confirmModal').modal('show');
        },

        deletItem: function(id) {
            var json = {
                api: config.apiServer + 'role/post',
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
                api: config.apiServer + 'role/get',
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

    $('body').delegate('.js_pageItem', 'click', function(e) {
        var p = $(e.currentTarget).data('page');
        page.init(p);
    });

    $('body').delegate('.js_add', 'click', function(e) {
        window.location.href = '/adm/role/add';
    });

    $('body').delegate('.js_edit', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        window.location.href = '/adm/role/edit/' + id;
    });

    $('body').delegate('.js_add_saveBtn', 'click', function() {
        var name = $('.js_add_name').val(),
            pms = '';
        $('input:checkbox[name=pms]:checked').each(function(i) {
            if (0 == i) {
                pms = $(this).val();
            } else {
                pms += (',' + $(this).val());
            }
        });

        var json = {
            api: config.apiServer + 'role/post',
            type: 'post',
            data: {
                actionxm: 'add',
                params: {
                    name: name,
                    pms: pms
                }
            }
        };
        var callback = function(res) {
            alert(res.msg);
            if (res.status == 0) {
                window.location.href = '/adm/role';
            }
        };
        json.callback = callback;
        Utils.requestData(json);
    });

    $('body').delegate('.js_update_saveBtn', 'click', function() {
        var id = $('.js_update_id').val(),
            name = $('.js_add_name').val(),
            pms = '';
        $('input:checkbox[name=pms]:checked').each(function(i) {
            if (0 == i) {
                pms = $(this).val();
            } else {
                pms += (',' + $(this).val());
            }
        });

        var json = {
            api: config.apiServer + 'role/post',
            type: 'post',
            data: {
                actionxm: 'update',
                id: id,
                params: {
                    name: name,
                    pms: pms
                }
            }
        };
        var callback = function(res) {
            alert(res.msg);
            if (res.status == 0) {
                window.location.href = '/adm/role';
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