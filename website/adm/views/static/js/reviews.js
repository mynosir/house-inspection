$(function() {
    var page = {
        init: function(p) {
            var json = {
                api: config.apiServer + 'reviews/get',
                type: 'get',
                data: {
                    actionxm: 'getReviews',
                    page: !p ? 1 : p,
                    size: 20,
                    keyword: $('#search_comment').val(),
                    propertyId: $('.propertyName').val()
                }
            };
            var callback = function(res) {
                // 处理表格数据
                var list = res['list'],
                    sex = ['male','female'],
                    status = ['show','hide'],
                    listTpl = '<tr><th>Serial No.</th><th>Property ID</th><th>Property Name</th><th>Wechat Nickname</th><th>Rate</th><th>Comment</th><th>Create Time</th><th>Status</th></tr>';
                for(var i in list) {
                  // console.log(p);
                    var listid = (res.page-1)*res.size+parseInt(i)+1;
                    listTpl += '<tr>';
                    listTpl += '<td>' + listid + '</td>';
                    listTpl += '<td>' + list[i]['propertyID'] + '</td>';
                    listTpl += '<td>' + list[i]['propertyName'] + '</td>';
                    // listTpl += '<td>' + list[i]['userid'] + '</td>';
                    listTpl += '<td>' + list[i]['wx_nickname'] + '</td>';
                    listTpl += '<td>' + list[i]['rate'] + '</td>';
                    listTpl += '<td>' + list[i]['content'] + '</td>';
                    listTpl += '<td>' + list[i]['create_time'] + '</td>';
                    // listTpl += '<td>' + status[list[i]['status']] + '</td>';
                    listTpl += '<td><select data-id='+list[i]['id']+' class="form-control selectSection"><option value="0">'+status[0]+'</option><option value="1">'+status[1]+'</option></select></td>';
                    listTpl += '</tr>';
                }
                $('.js_table').html(listTpl);

                for(var i in list){
                  $('.selectSection').eq(i).val(list[i]['status']);
                }

                // 处理分页
                var pageTpl = '',
                    total = parseInt(res.total),
                    size = parseInt(res.size),
                    page = parseInt(res.page),
                    itemNum = Math.ceil(total / size),
                    itemStart = 1,
                    itemMax = 1,
                    fisrtItemCls = page==1 ? ' class="disabled"' : '',
                    lastItemCls = page==itemNum ? ' class="disabled"' : '';
                pageTpl += '<li ' + fisrtItemCls + '><a href="javascript:void(0)" aria-label="Previous" data-page="1" class="js_pageItem"><span aria-hidden="true">&laquo;</span></a></li>';
                if(page>3) {
                    itemStart = (page + 2) > itemNum ? itemNum - 4 : page - 2;
                    itemMax = (page + 2) > itemNum ? itemNum : page + 2;
                } else {
                    itemMax = itemNum>=5 ? 5 : itemNum;
                }
                for(itemStart; itemStart<=itemMax; itemStart++) {
                    var pageItemCls = itemStart==page ? ' class="active"' : '';
                    pageTpl += '<li ' + pageItemCls + '><a href="javascript:void(0)" data-page="' + itemStart + '" class="js_pageItem">' + itemStart + '</a></li>';
                }
                pageTpl += '<li ' + lastItemCls + '><a href="javascript:void(0)" aria-label="Next" data-page="' + itemNum + '" class="js_pageItem"><span aria-hidden="true">&raquo;</span></a></li>';
                $('.js_page').html(pageTpl);
            };
            json.callback = callback;
            Utils.requestData(json);
        },
        updateConfirmTip: function(id,status) {
          $('#confirmModal').find('.js_sure_update').attr('data-id', id);
            $('#confirmModal').find('.js_sure_update').attr('data-status', status);
            $('#confirmModal').modal('show');
        },


        updateItem: function(id,status) {
          var json = {
              api: config.apiServer + 'reviews/post',
              type: 'post',
              data: {
                  actionxm: 'updateStatus',
                  id: id,
                  params: {
                    status: status
                  }
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
                api: config.apiServer + 'user/get',
                type: 'get',
                data: {
                    actionxm: 'getDetail',
                    id: !id ? 1 : id
                }
            };
            var callback = function(res) {
                $('.js_id').text(res.id);
                $('.js_photo_prev').attr('src', res.img);
                $('.js_update_link').val(res.link);
                $('.js_select').val(res.status);
                $('.js_update_sort').val(res.zorder);
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
                api: config.apiServer + 'user/post',
                type: 'post',
                data: {
                    actionxm: 'delete',
                    id: id
                }
            };
            var callback = function(res) {
                if(res.status==0) {
                    $('#confirmModal').modal('hide');
                    alert(res.msg);
                    window.location.reload();
                } else {
                    alert(res.msg);
                }
            };
            json.callback = callback;
            Utils.requestData(json);
        }
    };
    page.init();
    $('body').delegate('.js_pageItem', 'click', function(e) {
        var p = $(e.currentTarget).data('page');
        page.init(p);
    });
    $('body').delegate('.js_edit', 'click', function(e) {
        var id = $(e.currentTarget).data('id');
        page.getDetail(id);
    });
    $('body').delegate('.js_delete', 'click', function(e){
        var id = $(e.currentTarget).data('id');
        page.deleteConfirmTip(id);
    });
    $('body').delegate('.js_sure_delete', 'click', function(e){
        var id = $(e.currentTarget).data('id');
        page.deletItem(id);
    });
    $('body').delegate('.js_addPhoto', 'click', function(e) {
        if ($('#addModal').hasClass('in')) {
            $('.js_add_photo').val($('#prevArea').attr('src'));
            $('.js_add_photo_prev').attr('src', $('#prevArea').attr('src'));
        } else {
            $('.js_photo').val($('#prevArea').attr('src'));
            $('.js_photo_prev').attr('src', $('#prevArea').attr('src'));
        }
        $('#uploadModal').modal('hide');
    });
    $('body').delegate('.js_add_saveBtn', 'click', function() {
        var photo = $('.js_add_photo').val()=='' ? $('.js_add_photo_prev').attr('src') : $('.js_add_photo').val(),
            status = $('.js_add_select').val(),
            link = $('.js_add_link').val(),
            sort = $('.js_add_sort').val();
        var json = {
                api: config.apiServer + 'user/post',
                type: 'post',
                data: {
                    actionxm: 'addUser',
                    params: {
                        img: photo,
                        link: link,
                        status: status,
                        zorder: sort
                    }
                }
            };
        var callback = function(res) {
            if(res.status==0) {
                alert(res.msg);
                window.location.reload();
            } else {
                alert(res.msg);
            }
        };
        json.callback = callback;
        Utils.requestData(json);
    });
    $('body').delegate('.js_saveBtn', 'click', function() {
        var id = $('.js_id').text(),
            photo = $('.js_photo').val()=='' ? $('.js_photo_prev').attr('src') : $('.js_photo').val(),
            link = $('.js_update_link').val(),
            sort = $('.js_update_sort').val(),
            status = $('.js_select').val();
        var json = {
                api: config.apiServer + 'user/post',
                type: 'post',
                data: {
                    actionxm: 'updateUser',
                    id: id,
                    params: {
                        img: photo,
                        link: link,
                        zorder: sort,
                        status: status
                    }
                }
            };
        var callback = function(res) {
            if(res.status==0) {
                alert(res.msg);
                window.location.reload();
            } else {
                alert(res.msg);
            }
        };
        json.callback = callback;
        Utils.requestData(json);
    });
    $('#photo').uploadifive({
        fileTypeDesc: '上传文件',
        fileTypeExts: '*.jpg;*.jpeg;*.gif;*.png',
        multi: false,
        buttonText: '上传文件',
        height: '25',
        width: '100',
        method: 'post',
        fileObjName: 'uploadfile',
        uploadScript: config.apiServer + 'user/post',
        formData: {
            'actionxm': 'upload_photo'
        },
        onUploadComplete: function(file, data, response) {
            result = $.parseJSON(data);
            if(result['status']==0) {
                $('#prevArea').attr('src', result['name']);
            } else {
                alert(result['msg']);
            }
        }
    });

    $('body').delegate('.selectSection', 'change', function(e) {

      var id = $(e.currentTarget).data('id');
      var selectedStatus = e.currentTarget.options.selectedIndex;
      page.updateConfirmTip(id,selectedStatus)
    });

    $('#confirmModal').on('hide.bs.modal', function () {
      // 执行一些动作...
      window.location.reload();
    })

    $('body').delegate('.js_sure_update', 'click', function(e) {
      var id = $(e.currentTarget).data('id');
      var status = $(e.currentTarget).data('status');
      page.updateItem(id,status);
    });


    $('.js_searchFrom').submit(function(e) {
        e.preventDefault();
        // var p = $('.js_page li[class=active] a').data('page');
        page.init();
    });

});
