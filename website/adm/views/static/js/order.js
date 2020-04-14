$(function() {
    var page = {
        init: function(p, nickname, status) {
            var json = {
                api: config.apiServer + 'order/get',
                type: 'get',
                data: {
                    actionxm: 'getOrder',
                    page: !p ? 1 : p,
                    size: 20,
                    nickname: nickname,
                    status: status
                }
            };
            var callback = function(res) {
                // 处理表格数据
                var list = res['list'],
                    show = ['show','hide'],
                    // status = ['to be paid','paid','reserve success','reserve cancelled'],
                    statusArray = [
                      {
                      'status': 0,
                      'value': 'To Be Paid'
                      },
                      {
                        'status': 1,
                        'value': 'Paid'
                      },
                      {
                        'status': 2,
                        'value': 'Reserve Success'
                      },
                      {
                        'status': -1,
                        'value': 'Reserve Cancelled'
                      }
                    ],
                    listTpl = '<tr><th>Serial No.</th><th>Trade No.</th><th>Property Name</th><th>Reservation ID</th><th>Wechat Nickname</th><th>Total Price</th><th>Start Date</th><th>End Date</th><th>Guest Firstname</th><th>Guest Lastname</th><th>Guest Country</th><th>Guest Zip</th><th>Guest Email</th><th>Guest Phone</th><th>Room Type</th><th>Quantity</th><th>Adults Quantity</th><th>Children Quantity</th><th>Create Time</th></tr>';
                    listTpl2 = '<tr><th>Status</th></tr>';

                    // console.log(list);
                function getStatus(status) {
                  for (var i = 0; i < statusArray.length; i++) {
                    if (statusArray[i]['status']==status) {
                      return statusArray[i]['value'];
                    }
                  }
                }
                for(var i in list) {
                    if(list[i]['total']==null){
                      list[i]['total']='';
                    }
                    if(list[i]['startDate']==null){
                      list[i]['startDate']='';
                    }
                    if(list[i]['endDate']==null){
                      list[i]['endDate']='';
                    }
                    if(list[i]['balance']==null){
                      list[i]['balance']='';
                    }
                    if(list[i]['assigned']==null){
                      list[i]['assigned']='';
                    }
                    if(list[i]['unassigned']==null){
                      list[i]['unassigned']='';
                    }
                    if(list[i]['cardsOnFile']==null){
                      list[i]['cardsOnFile']='';
                    }
                    if(list[i]['reservationID']==null){
                      list[i]['reservationID']='';
                    }
                    if(list[i]['estimatedArrivalTime']==null){
                      list[i]['estimatedArrivalTime']='';
                    }
                    if(list[i]['cardsOnFile']==null){
                      list[i]['cardsOnFile']='';
                    }
                    if(list[i]['outTradeNo']==null){
                      list[i]['outTradeNo']='';
                    }
                    if(list[i]['roomTypeName']==null){
                      list[i]['roomTypeName']='';
                    }
                    var listid = (res.page-1)*res.size+parseInt(i)+1;
                    listTpl += '<tr>';
                    listTpl2 += '<tr>';
                    listTpl += '<td>' + listid + '</td>';
                    // listTpl += '<td>' + list[i]['openid'] + '</td>';
                    listTpl += '<td>' + list[i]['outTradeNo'] + '</td>';
                    // listTpl += '<td>' + list[i]['propertyID'] + '</td>';
                    listTpl += '<td>' + list[i]['propertyName'] + '</td>';
                    listTpl += '<td>' + list[i]['reservationID'] + '</td>';
                    listTpl += '<td>' + list[i]['wx_nickname'] + '</td>';
                    listTpl += '<td>' + list[i]['total'] + '</td>';
                    // listTpl += '<td>' + list[i]['balance'] + '</td>';
                    // listTpl += '<td>' + list[i]['source_prize'] + '</td>';
                    // listTpl += '<td>' + list[i]['coupon_id'] + '</td>';
                    listTpl += '<td>' + list[i]['startDate'] + '</td>';
                    listTpl += '<td>' + list[i]['endDate'] + '</td>';
                    listTpl += '<td>' + list[i]['guestFirstName'] + '</td>';
                    listTpl += '<td>' + list[i]['guestLastName'] + '</td>';
                    listTpl += '<td>' + list[i]['guestCountry'] + '</td>';
                    listTpl += '<td>' + list[i]['guestZip'] + '</td>';
                    listTpl += '<td>' + list[i]['guestEmail'] + '</td>';
                    listTpl += '<td>' + list[i]['guestPhone'] + '</td>';
                    // listTpl += '<td>' + list[i]['rooms'] + '</td>';
                    listTpl += '<td>' + list[i]['roomTypeName'] + '</td>';
                    listTpl += '<td>' + list[i]['rooms_quantity'] + '</td>';
                    // listTpl += '<td>' + list[i]['adults'] + '</td>';
                    // listTpl += '<td>' + list[i]['adults_roomTypeID'] + '</td>';
                    listTpl += '<td>' + list[i]['adults_quantity'] + '</td>';
                    // listTpl += '<td>' + list[i]['children'] + '</td>';
                    // listTpl += '<td>' + list[i]['children_roomTypeID'] + '</td>';
                    listTpl += '<td>' + list[i]['children_quantity'] + '</td>';
                    // listTpl += '<td>' + getStatus(list[i]['status']) + '</td>';
                    // listTpl += '<td>' + list[i]['frontend_total'] + '</td>';
                    // listTpl += '<td>' + list[i]['balanceDetailed'] + '</td>';
                    // listTpl += '<td>' + list[i]['assigned'] + '</td>';
                    // listTpl += '<td>' + list[i]['unassigned'] + '</td>';
                    // listTpl += '<td>' + list[i]['cardsOnFile'] + '</td>';
                    // listTpl += '<td>' + list[i]['estimatedArrivalTime'] + '</td>';
                    listTpl += '<td>' + list[i]['create_time'] + '</td>';
                    // listTpl += '<td>' + list[i]['transaction_id'] + '</td>';
                    // listTpl += '<td>' + list[i]['transaction_info'] + '</td>';
                    listTpl += '</tr>';
                    listTpl2 += '<td>' + getStatus(list[i]['status']) + '</td>';
                    listTpl2 += '</tr>';
                }
                $('.js_table').html(listTpl)
                $('.js_table2').html(listTpl2);

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
        export: function(id) {
            var json = {
                api: config.apiServer + 'order/get',
                type: 'get',
                data: {
                    actionxm: 'export'
                }
            };
            var callback = function(res) {
              // console.log(res);
            };
            json.callback = callback;
            Utils.requestData(json);
            window.location.href = config.apiServer+'order/get?actionxm=export';
        },
        getDetail: function(id) {
            var json = {
                api: config.apiServer + 'order/get',
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
                api: config.apiServer + 'order/post',
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
    $('body').delegate('#export', 'click', function(e){
        e.preventDefault();
        page.export();
    });
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
                api: config.apiServer + 'order/post',
                type: 'post',
                data: {
                    actionxm: 'addOrder',
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
                api: config.apiServer + 'order/post',
                type: 'post',
                data: {
                    actionxm: 'updateOrder',
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
        fileTypeDesc: 'uploadfile',
        fileTypeExts: '*.jpg;*.jpeg;*.gif;*.png',
        multi: false,
        buttonText: 'uploadfile',
        height: '25',
        width: '100',
        method: 'post',
        fileObjName: 'uploadfile',
        uploadScript: config.apiServer + 'order/post',
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
    $('.js_searchFrom').submit(function(e) {
        e.preventDefault();
        // var p = $('.js_page li[class=active] a').data('page');
        var nickname = $('#nickname').val();
        var status = $('#status').val();
        // console.log(nickname);
        // console.log(status);
        page.init(1, nickname, status);
    });

});
