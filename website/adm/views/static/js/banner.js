$(function() {
    var page = {
        init: function(p) {
            var json = {
                api: config.apiServer + 'banner/get',
                type: 'get',
                data: {
                    actionxm: 'getAds',
                    page: !p ? 1 : p,
                    size: 20,
                    classify: 0
                }
            };
            var callback = function(res) {
                // 处理表格数据
                var list = res['list'],
                    show = ['Show','Hide'],
                    listTpl = '<tr><th>Serial No.</th><th>Link</th><th>Image</th><th>Status</th><th>Rank(Sort Desending)</th><th>Operation</th></tr>';
                for(var i in list) {
                    var listid = (res.page-1)*res.size+parseInt(i)+1;
                    listTpl += '<tr>';
                    listTpl += '<td>' + listid + '</td>';
                    listTpl += '<td><a href="' + list[i]['link'] + '" target="blank">' + list[i]['link'] + '</a></td>';
                    listTpl += '<td><img src="' + list[i]['img'] + '" style="width: 120px; height: 60px;"></td>';
                    listTpl += '<td>' + show[list[i]['status']] + '</td>';
                    listTpl += '<td>' + list[i]['zorder'] + '</td>';
                    listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_edit" data-toggle="modal" data-target="#editModal" data-id="' + list[i]['id'] + '">Edit</button>&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger js_delete" data-id="' + list[i]['id'] + '">Delete</button></td>';
                    listTpl += '</tr>';
                }
                $('.js_table').html(listTpl);
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
        initTicketList2: function(p) {
          var self = this,
              json = {
                  api: config.apiServer + 'ticket/get',
                  type: 'get',
                  data: {
                      actionxm: 'search',
                      page: !p ? 1 : p,
                      size: 20,
                      keyword: $('#search_title2').val()
                  }
              };
          var callback = function(res) {
                  var idx = 1,
                      list = res['list'],
                      status = ['Unread','Read'],
                      listTpl = '<tr><th>Serial No.</th><th>Product ID</th><th>Type</th><th>Title</th><th>Title(Chinese)</th><th>Operation</th></tr>';
                  for(var i in list) {
                      var listid = (res.page-1)*res.size+parseInt(i)+1;
                      // if(list[i]['name_cn'] ==undefined){
                      //   list[i]['name_cn'] = ''
                      // }
                      listTpl += '<tr>';
                      listTpl += '<td>' + listid + '</td>';
                      listTpl += '<td>' + list[i]['productId'] + '</td>';
                      listTpl += '<td>' + list[i]['type'] + '</td>';
                      listTpl += '<td>' + list[i]['title'] + '</td>';
                      listTpl += '<td>' + list[i]['title_cn'] + '</td>';
                      // listTpl += '<td>' + list[i]['roomTypeNameShort'] + '</td>';
                      listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_confirm_ticket2" data-productId="' + list[i]['productId'] + '" data-type="' + list[i]['type'] + '">Confirm</button></td>';

                      listTpl += '</tr>';
                  }
                  $('.js_table3').html(listTpl);
              // } else {
              //     alert(res.msg);
              // }

                  // for(var i in list){
                  //   $('.selectSection').eq(i).val(list[i]['status']);
                  //   $('.selectRecommend').eq(i).val(list[i]['recommend']);
                  // }

                  // 处理分页
                  var pageTpl = '',
                      total = parseInt(res.total),//18
                      size = parseInt(res.size),//5
                      page = parseInt(res.page),//4
                      itemNum = Math.ceil(total / size),//4
                      itemStart = 1,
                      itemMax = 1,
                      fisrtItemCls = page==1 ? ' class="disabled"' : '',
                      lastItemCls = page==itemNum ? ' class="disabled"' : '';
                  pageTpl += '<li ' + fisrtItemCls + '><a href="javascript:void(0)" aria-label="Previous" data-page="1" class="js_pageItem3"><span aria-hidden="true">&laquo;</span></a></li>';
                  if(page>4) {
                      itemStart = (page + 2) > itemNum ? itemNum - 4 : page - 2;//2
                      itemMax = (page + 2) > itemNum ? itemNum : page + 2;//4
                  } else {
                      itemMax = itemNum>=5 ? 5 : itemNum;
                  }
                  for(itemStart; itemStart<=itemMax; itemStart++) {
                      var pageItemCls = itemStart==page ? ' class="active"' : '';
                      pageTpl += '<li ' + pageItemCls + '><a href="javascript:void(0)" data-page="' + itemStart + '" class="js_pageItem3">' + itemStart + '</a></li>';
                  }
                  pageTpl += '<li ' + lastItemCls + '><a href="javascript:void(0)" aria-label="Next" data-page="' + itemNum + '" class="js_pageItem3"><span aria-hidden="true">&raquo;</span></a></li>';
                  $('.js_page3').html(pageTpl);

          };
          json.callback = callback;
          Utils.requestData(json);

        },
        initTicketList: function(p) {
          var self = this,
              json = {
                  api: config.apiServer + 'ticket/get',
                  type: 'get',
                  data: {
                      actionxm: 'search',
                      page: !p ? 1 : p,
                      size: 20,
                      keyword: $('#search_title').val()
                  }
              };
          var callback = function(res) {
                  var idx = 1,
                      list = res['list'],
                      status = ['Unread','Read'],
                      listTpl = '<tr><th>Serial No.</th><th>Product ID</th><th>Type</th><th>Title</th><th>Title(Chinese)</th><th>Operation</th></tr>';
                  for(var i in list) {
                      var listid = (res.page-1)*res.size+parseInt(i)+1;
                      // if(list[i]['name_cn'] ==undefined){
                      //   list[i]['name_cn'] = ''
                      // }
                      listTpl += '<tr>';
                      listTpl += '<td>' + listid + '</td>';
                      listTpl += '<td>' + list[i]['productId'] + '</td>';
                      listTpl += '<td>' + list[i]['type'] + '</td>';
                      listTpl += '<td>' + list[i]['title'] + '</td>';
                      listTpl += '<td>' + list[i]['title_cn'] + '</td>';
                      // listTpl += '<td>' + list[i]['roomTypeNameShort'] + '</td>';
                      listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_confirm_ticket" data-productId="' + list[i]['productId'] + '" data-type="' + list[i]['type'] + '">Confirm</button></td>';

                      listTpl += '</tr>';
                  }
                  $('.js_table2').html(listTpl);
              // } else {
              //     alert(res.msg);
              // }

                  // for(var i in list){
                  //   $('.selectSection').eq(i).val(list[i]['status']);
                  //   $('.selectRecommend').eq(i).val(list[i]['recommend']);
                  // }

                  // 处理分页
                  var pageTpl = '',
                      total = parseInt(res.total),//18
                      size = parseInt(res.size),//5
                      page = parseInt(res.page),//4
                      itemNum = Math.ceil(total / size),//4
                      itemStart = 1,
                      itemMax = 1,
                      fisrtItemCls = page==1 ? ' class="disabled"' : '',
                      lastItemCls = page==itemNum ? ' class="disabled"' : '';
                  pageTpl += '<li ' + fisrtItemCls + '><a href="javascript:void(0)" aria-label="Previous" data-page="1" class="js_pageItem2"><span aria-hidden="true">&laquo;</span></a></li>';
                  if(page>4) {
                      itemStart = (page + 2) > itemNum ? itemNum - 4 : page - 2;//2
                      itemMax = (page + 2) > itemNum ? itemNum : page + 2;//4
                  } else {
                      itemMax = itemNum>=5 ? 5 : itemNum;
                  }
                  for(itemStart; itemStart<=itemMax; itemStart++) {
                      var pageItemCls = itemStart==page ? ' class="active"' : '';
                      pageTpl += '<li ' + pageItemCls + '><a href="javascript:void(0)" data-page="' + itemStart + '" class="js_pageItem2">' + itemStart + '</a></li>';
                  }
                  pageTpl += '<li ' + lastItemCls + '><a href="javascript:void(0)" aria-label="Next" data-page="' + itemNum + '" class="js_pageItem2"><span aria-hidden="true">&raquo;</span></a></li>';
                  $('.js_page2').html(pageTpl);

          };
          json.callback = callback;
          Utils.requestData(json);

        },
        getTicketId2: function(productId,type) {
          console.log(productId);
          console.log(type);
          var json = {
              api: config.apiServer + 'ticket/post',
              type: 'post',
              data: {
                  actionxm: 'getTicketId',
                  params: {
                    productId: productId,
                    type: type
                  }
              }
          };
          var callback = function(res) {
            $('#update_ticket_id').val(res);
          }
          json.callback = callback;
          Utils.requestData(json);

        },
        getTicketId: function(productId,type) {
          console.log(productId);
          console.log(type);
          var json = {
              api: config.apiServer + 'ticket/post',
              type: 'post',
              data: {
                  actionxm: 'getTicketId',
                  params: {
                    productId: productId,
                    type: type
                  }
              }
          };
          var callback = function(res) {
            $('#ticket_id').val(res);
          }
          json.callback = callback;
          Utils.requestData(json);

        },
        getTicketList: function(p) {
            var json = {
                api: config.apiServer + 'ticket/get',
                type: 'get',
                data: {
                    actionxm: 'search',
                    page: !p ? 1 : p,
                    size: 20,
                    keyword: $('#search_title').val()
                }
            };
            var callback = function(res) {
                    var idx = 1,
                        list = res['list'],
                        status = ['Unread','Read'],
                        listTpl = '<tr><th>Serial No.</th><th>Product ID</th><th>Type</th><th>Title</th><th>Title(Chinese)</th><th>Operation</th></tr>';
                    for(var i in list) {
                        var listid = (res.page-1)*res.size+parseInt(i)+1;
                        // if(list[i]['name_cn'] ==undefined){
                        //   list[i]['name_cn'] = ''
                        // }
                        listTpl += '<tr>';
                        listTpl += '<td>' + listid + '</td>';
                        listTpl += '<td>' + list[i]['productId'] + '</td>';
                        listTpl += '<td>' + list[i]['type'] + '</td>';
                        listTpl += '<td>' + list[i]['title'] + '</td>';
                        listTpl += '<td>' + list[i]['title_cn'] + '</td>';
                        // listTpl += '<td>' + list[i]['roomTypeNameShort'] + '</td>';
                        listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_confirm_ticket" data-productId="' + list[i]['productId'] + '" data-type="' + list[i]['type'] + '">Confirm</button></td>';
                        listTpl += '</tr>';
                    }
                    $('.js_table2').html(listTpl);
                // } else {
                //     alert(res.msg);
                // }

                    // for(var i in list){
                    //   $('.selectSection').eq(i).val(list[i]['status']);
                    //   $('.selectRecommend').eq(i).val(list[i]['recommend']);
                    // }

                    // 处理分页
                    var pageTpl = '',
                        total = parseInt(res.total),//18
                        size = parseInt(res.size),//5
                        page = parseInt(res.page),//4
                        itemNum = Math.ceil(total / size),//4
                        itemStart = 1,
                        itemMax = 1,
                        fisrtItemCls = page==1 ? ' class="disabled"' : '',
                        lastItemCls = page==itemNum ? ' class="disabled"' : '';
                    pageTpl += '<li ' + fisrtItemCls + '><a href="javascript:void(0)" aria-label="Previous" data-page="1" class="js_pageItem"><span aria-hidden="true">&laquo;</span></a></li>';
                    if(page>4) {
                        itemStart = (page + 2) > itemNum ? itemNum - 4 : page - 2;//2
                        itemMax = (page + 2) > itemNum ? itemNum : page + 2;//4
                    } else {
                        itemMax = itemNum>=5 ? 5 : itemNum;
                    }
                    for(itemStart; itemStart<=itemMax; itemStart++) {
                        var pageItemCls = itemStart==page ? ' class="active"' : '';
                        pageTpl += '<li ' + pageItemCls + '><a href="javascript:void(0)" data-page="' + itemStart + '" class="js_pageItem">' + itemStart + '</a></li>';
                    }
                    pageTpl += '<li ' + lastItemCls + '><a href="javascript:void(0)" aria-label="Next" data-page="' + itemNum + '" class="js_pageItem"><span aria-hidden="true">&raquo;</span></a></li>';
                    $('.js_page2').html(pageTpl);

            };

            json.callback = callback;
            Utils.requestData(json);
        },
        getTicketList2: function(p) {
            var json = {
                api: config.apiServer + 'ticket/get',
                type: 'get',
                data: {
                    actionxm: 'search',
                    page: !p ? 1 : p,
                    size: 20,
                    keyword: $('#search_title2').val()
                }
            };
            var callback = function(res) {
                    var idx = 1,
                        list = res['list'],
                        status = ['Unread','Read'],
                        listTpl = '<tr><th>Serial No.</th><th>Product ID</th><th>Type</th><th>Title</th><th>Title(Chinese)</th><th>Operation</th></tr>';
                    for(var i in list) {
                        var listid = (res.page-1)*res.size+parseInt(i)+1;
                        // if(list[i]['name_cn'] ==undefined){
                        //   list[i]['name_cn'] = ''
                        // }
                        listTpl += '<tr>';
                        listTpl += '<td>' + listid + '</td>';
                        listTpl += '<td>' + list[i]['productId'] + '</td>';
                        listTpl += '<td>' + list[i]['type'] + '</td>';
                        listTpl += '<td>' + list[i]['title'] + '</td>';
                        listTpl += '<td>' + list[i]['title_cn'] + '</td>';
                        // listTpl += '<td>' + list[i]['roomTypeNameShort'] + '</td>';
                        listTpl += '<td><button type="button" class="btn btn-sm btn-primary js_confirm_ticket2" data-productId="' + list[i]['productId'] + '" data-type="' + list[i]['type'] + '">Confirm</button></td>';
                        listTpl += '</tr>';
                    }
                    $('.js_table3').html(listTpl);
                // } else {
                //     alert(res.msg);
                // }

                    // for(var i in list){
                    //   $('.selectSection').eq(i).val(list[i]['status']);
                    //   $('.selectRecommend').eq(i).val(list[i]['recommend']);
                    // }

                    // 处理分页
                    var pageTpl = '',
                        total = parseInt(res.total),//18
                        size = parseInt(res.size),//5
                        page = parseInt(res.page),//4
                        itemNum = Math.ceil(total / size),//4
                        itemStart = 1,
                        itemMax = 1,
                        fisrtItemCls = page==1 ? ' class="disabled"' : '',
                        lastItemCls = page==itemNum ? ' class="disabled"' : '';
                    pageTpl += '<li ' + fisrtItemCls + '><a href="javascript:void(0)" aria-label="Previous" data-page="1" class="js_pageItem"><span aria-hidden="true">&laquo;</span></a></li>';
                    if(page>4) {
                        itemStart = (page + 2) > itemNum ? itemNum - 4 : page - 2;//2
                        itemMax = (page + 2) > itemNum ? itemNum : page + 2;//4
                    } else {
                        itemMax = itemNum>=5 ? 5 : itemNum;
                    }
                    for(itemStart; itemStart<=itemMax; itemStart++) {
                        var pageItemCls = itemStart==page ? ' class="active"' : '';
                        pageTpl += '<li ' + pageItemCls + '><a href="javascript:void(0)" data-page="' + itemStart + '" class="js_pageItem">' + itemStart + '</a></li>';
                    }
                    pageTpl += '<li ' + lastItemCls + '><a href="javascript:void(0)" aria-label="Next" data-page="' + itemNum + '" class="js_pageItem"><span aria-hidden="true">&raquo;</span></a></li>';
                    $('.js_page3').html(pageTpl);

            };

            json.callback = callback;
            Utils.requestData(json);
        },
        getDetail: function(id) {
            var json = {
                api: config.apiServer + 'banner/get',
                type: 'get',
                data: {
                    actionxm: 'getDetail',
                    id: !id ? 1 : id
                }
            };
            var callback = function(res) {
                $('.js_id').text(res.id);
                $('.js_photo_prev').attr('src', res.img);
                $('.js_select').val(res.status);
                $('.js_update_sort').val(res.zorder);
                $('.js_update_link').val(res.link);
                console.log(res.link.indexOf('ticket'));
                console.log(res.link.indexOf('hotel'));
                var start = res.link.indexOf('id=');
                var id = res.link.substring(start+3);
                if (res.link.indexOf('hotel')!=-1) {
                  $('input[type=radio][name=update_link]')[0].checked = true
                  $('.property_update').show();
                  $('.ticket_update').hide();
                  // $('#update_property_id').val()
                  $("#update_property_id option[value='"+id+"']").prop("selected","selected");
                }
                if (res.link.indexOf('ticket')!=-1) {
                  $('input[type=radio][name=update_link]')[1].checked = true
                  $('.property_update').hide();
                  $('.ticket_update').show();
                  $('#update_ticket_id').val(id);
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
                api: config.apiServer + 'banner/post',
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
    $('body').delegate('.js_confirm_ticket2', 'click', function(e) {
        var id = $(e.currentTarget).data('productid');
        var type = $(e.currentTarget).data('type');
        page.getTicketId2(id, type);
        $('#selectUpdateTicketModal').modal('hide');

    });
    $('body').delegate('.js_confirm_ticket', 'click', function(e) {
        var id = $(e.currentTarget).data('productid');
        var type = $(e.currentTarget).data('type');
        page.getTicketId(id, type);
        $('#selectTicketModal').modal('hide');

    });
    $('body').delegate('.js_select_update_ticket', 'click', function(e) {
        $('#search_title2').val('');
        page.getTicketList2();
    });
    $('body').delegate('.js_select_ticket', 'click', function(e) {
        $('#search_title').val('');
        page.getTicketList();
    });
    $('body').delegate('.js_pageItem3', 'click', function(e) {
        var p = $(e.currentTarget).data('page');
        page.getTicketList(p);
    });
    $('body').delegate('.js_pageItem2', 'click', function(e) {
        var p = $(e.currentTarget).data('page');
        page.getTicketList(p);
    });
    $('body').delegate('.js_pageItem', 'click', function(e) {
        var p = $(e.currentTarget).data('page');
        page.init(p);
    });
    $('body').delegate('.js_edit', 'click', function(e) {

      $('#update_property_id').val('');
      $('#update_ticket_id').val('');
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
      if ($('input[type=radio][name=link]:checked').val()==1) {
        if($('#property_id').val()==''||undefined){
          alert('Property ID is Null');
          return
        }else{
          var link = '/pages/hotel/detail/detail?id='+$('#property_id').val();
        }
      }else if($('input[type=radio][name=link]:checked').val()==2){
        if($('#ticket_id').val()==''||undefined){
          alert('Ticket ID is Null');
          return
        }else{
          var link = '/pages/ticket/detail/detail?id='+$('#ticket_id').val();
        }

      }
        var photo = $('.js_add_photo').val()=='' ? $('.js_add_photo_prev').attr('src') : $('.js_add_photo').val(),
            status = $('.js_add_select').val(),
            // link = $('.js_add_link').val(),
            sort = $('.js_add_sort').val();
        if (photo==undefined) {
          alert('Image is Null');
          return
        }
        var json = {
                api: config.apiServer + 'banner/post',
                type: 'post',
                data: {
                    actionxm: 'addAds',
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
        if ($('input[type=radio][name=update_link]:checked').val()==1) {
          if($('#update_property_id').val()==''||undefined){
            alert('Property ID is Null');
            return
          }else{
            var link = '/pages/hotel/detail/detail?id='+$('#update_property_id').val();
          }
        }else if($('input[type=radio][name=update_link]:checked').val()==2){
          if($('#update_ticket_id').val()==''||undefined){
            alert('Ticket ID is Null');
            return
          }else{
            var link = '/pages/ticket/detail/detail?id='+$('#update_ticket_id').val();
          }

        }
        var id = $('.js_id').text(),
            photo = $('.js_photo').val()=='' ? $('.js_photo_prev').attr('src') : $('.js_photo').val(),
            // link = $('.js_update_link').val(),
            sort = $('.js_update_sort').val(),
            status = $('.js_select').val();
        var json = {
                api: config.apiServer + 'banner/post',
                type: 'post',
                data: {
                    actionxm: 'updateAds',
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
        uploadScript: config.apiServer + 'banner/post',
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

    $('input[type=radio][name=link]').change(function() {
        if (this.value == 1) {
            $('.ticket_add').hide();
            $('.property_add').show();
        }
        else if (this.value == 2) {
            $('.property_add').hide();
            $('.ticket_add').show();
        }
    });

    $('input[type=radio][name=update_link]').change(function() {
        if (this.value == 1) {
            $('.ticket_update').hide();
            $('.property_update').show();
        }
        else if (this.value == 2) {
            $('.property_update').hide();
            $('.ticket_update').show();
        }
    });


    $('.js_searchFrom').submit(function(e) {
        e.preventDefault();
        // var p = $('.js_page li[class=active] a').data('page');
        page.initTicketList();
    });
    $('.js_searchFrom2').submit(function(e) {
        e.preventDefault();
        // var p = $('.js_page li[class=active] a').data('page');
        page.initTicketList2();
    });
  // $('#selectUpdateTicketModal').on('hide.bs.modal', function () {
  //   // 执行一些动作...
  //   $('#update_ticket_id').val('');
  // })
});
