/**
 * Created by Administrator on 2018/3/18.
 */


var perpage = 2;
var page = 1;
var pages = 0;
var comments = [];

$('#messageBtn').on('click', function () {
    console.log($('#roomId').val());
    $.ajax({
        type: 'POST',
        url: '/comment/post',
        data: {
            roomid: $('#roomId').val(),
            writedContent: $('#messageTextarea').val()
        },
        success: function (responseData) {
            // // console.log(responseData);
            // $('#messageTextarea').val('');
            if(!responseData.data) {
                window.location.reload();
                return;
            }
            comments = responseData.data.comments.reverse();
            console.log(comments);
            renderComment();
        }
    });
    
});
//每次页面重载时获取所有评论
$.ajax({
    type: 'GET',
    url: '/comment/get',
    data: {
        roomid: $('#roomId').val()
    },
    success: function (responseData) {
        // console.log(responseData);
        // $('#messageContent').val('');
        comments = responseData.data.reverse();
        console.log(comments);
        renderComment();
    }
});

// $('.pager').delegate('a', 'click', function () {
//     if($(this).parent().hasClass('previous')) {
//
//         page --;
//         renderComment();
//     }else {
//         page = page + 1;
//         // alert(page);
//         renderComment();
//     }
//
// });

// <div id="commentsList">
//     <p>评论列表</p>
//     <div class="commentsItem">
//     <div class="message-info">
//     <span class="username">老王</span>
//     <i>2018-4-04 12:20:30</i>
// </div>
// <div class="message-item">
//     <p>这家民宿真的很不错的，老板人很好。还哎难受做早餐给我们吃。这家民宿真的很不错的，老板人很好。还哎难受做早餐给我们吃。这家民宿真的很不错的，老板人很好。还哎难受做早餐给我们吃。这家民宿真的很不错的，老板人很好。还哎难受做早餐给我们吃。
// </p>
// <div class="imgs">
//     <img src="/public/images/comments/comment1.png" alt=""></p>
//     <img src="/public/images/comments/comment2.png" alt=""></p>
//     <img src="/public/images/comments/comment3.png" alt=""></p>
//     </div>
//     </div>
//     </div>


function renderComment() {
    // $('#message-count').html(comments.length);
    // console.log(page + "  / " + pages);
    // var start = Math.max(0, (page - 1) * perpage);
    // var end = Math.min(start + perpage, comments.length);
    var html = '';
    for(var i = 0; i < comments.length; i ++ ) {
        html +=
            '<div class="commentsItem">' + 
            '<div class="message-info">' +
            '<span class="username">' + comments[i].username + '</span>' +
                '<i>' + formatDate(comments[i].postTime) + '</i>' + '</div>' +
                '<div class="message-item">' + '<p>' + comments[i].writedContent + ' </p>' +
            '</div>' + '</div>' ;
    }
    console.log(html);
    $('#commentsList').append(html);

    // pages = Math.max(Math.ceil(comments.length / perpage), 1);
    // console.log(page + "  / " + pages);
    // $('.pager').find('li').eq(1).html( page + '/' + pages);
    // if( page <= 1) {
    //     page = 1;
    //     $('.pager').find('li').eq(0).html( '<a href="">' + '没有上一页了' + '</a>');
    // }else {
    //     $('.pager').find('li').eq(0).html( '<a href="">' + '上一页' + '</a>');
    // }
    // if (page >= pages) {
    //     page = pages;
    //     $('.pager').find('li').eq(2).html( '<a href="">' + '没有下一页了' + '</a>');
    // }else {
    //     $('.pager').find('li').eq(2).html( '<a href="">' + '下一页' + '</a>');
    // }
}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' +  date1.getDate() + ' ' +  date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}