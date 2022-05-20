var headers = {
        "Content-Type": "application/json",
        "X-Bmob-Application-Id": $('meta[name="bmob-app-id"]').attr('content'),
        "X-Bmob-REST-API-Key": $('meta[name="bmob-rest-key"]').attr('content')
    },
    perPage = 8,
    url = 'https://api2.bmob.cn/1/classes/' + ($('meta[name="bmob-message-table"]').attr('content') || 'message');

$(document).ready(function () {
    loadMessage(1);
    $("#form").submit(function (e) {
        e.preventDefault();

        var d = {};
        var t = $(this).serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });

        $.ajax({
            dataType: "json",
            data: JSON.stringify(d),
            url: url,
            type: 'post',
            headers: headers,
            error: function (e) {
                console.info(e);
            },
            complete: function () {
                $('#myModal').modal('hide');
                loadMessage(1);
                $("form")[0].reset();
            }
        });
    });
})

function loadMessage(page) {
    var offset = (page - 1) * perPage;
    // var commentHtml =
    //     "<li class=\"comment\">" +
    //     "<div class=\"comment-body\"><div class=\"comment-heading\"><h4 class=\"user\">" + user +
    //     "</h4><h5 class=\"time\">" + updated_at +
    //     "</h5></div><p>" + body +
    //     "</p></div></li>";
    $.ajax({
        dataType: 'json',
        data: {
            "limit": perPage,
            "skip": offset,
            "count": 1,
            "order": "-createdAt",
            "keys": "contact,msg,name"
        },
        url: url,
        headers: headers,
        success: function (data) {
            renderData(data, page);
        },
        error: function (e) {
            console.info(e);
            renderData({
                results: [],
                count: 0
            }, 1);
        }
    });
}

function renderData(data, current) {
    $("#noResults").hide();
    if (data.count) {
        var pages = Math.ceil(data.count / perPage);
        $('#commentsList').children().remove();
        $('#pagination').children().remove();
        if (pages > 1) {
            for (var page = 1; page <= pages; page++) {
                $('#pagination').append(
                    $('<li></li>')
                        .attr('class', page === current ? 'active' : '')
                        .append(
                            $('<a href="#"></a>')
                                .text(page)
                                .attr('onclick', 'loadMessage(' + page + ')')
                        )
                );
            }
        }

        $.each(data.results, function (i, e) {
            $('#commentsList').append(
                $('<li class="comment"></li>')
                    .append(
                        $('<div class="comment-body"></div>')
                            .append(
                                $('<div class="comment-heading"></div>')
                                    .append($('<h4 class="user"></h4>').text(e.name))
                                    .append($('<h4 class="time"></h4>').text(e.createdAt))
                            )
                            .append($('<p style="font-size: 13px;word-wrap: break-word;"></p>').text(e.msg))
                    )
            );
        });
    } else {
        $("#noResults").show();
    }
}

function openModal() {
    $('#myModal').modal({keyboard: false, backdrop: 'static'});
}