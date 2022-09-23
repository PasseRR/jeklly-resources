var key = $('meta[name="bmob-app-id"]').attr('content'),
    token = $('meta[name="bmob-rest-key"]').attr('content'),
    perPage = 8,
    // trello = "https://api.trello.com/1/cards/632d5e7da375620029986942/actions?key=3f2b257266b4f2f0ebf13e96776cb0f3&token=346e810c8fe7cfccd6d403fb86c96489c9d1716555d87b9f28c5cfe8f2d055fd&limit=2&fields=data,date&memberCreator=false&member=false&page=0";
    url = "https://api.trello.com/1/cards/" + $('meta[name="bmob-message-table"]').attr('content') + "/actions",
    pages = 0;

$(document).ready(function () {
    initMessage();
    $("#form").submit(function (e) {
        e.preventDefault();

        var d = {};
        var t = $(this).serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });

        $.ajax({
            dataType: "json",
            data: {
                text: JSON.stringify(d),
                key: key,
                token: token
            },
            url: url + "/comments",
            type: 'post',
            headers: headers,
            error: function (e) {
                console.info(e);
            },
            complete: function () {
                $('#myModal').modal('hide');
                initMessage();
                $("form")[0].reset();
            }
        });
    });
})

function initMessage() {
    $.ajax({
        dataType: 'json',
        data: {
            "key": key,
            "token": token,
            "format": "count",
            "fields": "id",
            "memberCreator": false,
            "member": false
        },
        url: url,
        headers: headers,
        success: function (data) {
            pages = Math.ceil(data._value / perPage);
            loadMessage(1);
        },
        error: function (e) {
            console.info(e);
            renderData({results: [], count: 0}, 1);
        }
    });
}

function loadMessage(page) {
    $.ajax({
        dataType: 'json',
        data: {
            "key": key,
            "token": token,
            "limit": perPage,
            "page": page - 1,
            "fields": "data,date",
            "memberCreator": false,
            "member": false
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
            var data = JSON.parse(e.data.text());
            $('#commentsList').append(
                $('<li class="comment"></li>')
                    .append(
                        $('<div class="comment-body"></div>')
                            .append(
                                $('<div class="comment-heading"></div>')
                                    .append($('<h4 class="user"></h4>').text(data.name))
                                    .append($('<h4 class="time"></h4>').text(new Date(e.date).toLocaleString()))
                            )
                            .append($('<p style="font-size: 13px;word-wrap: break-word;white-space:pre-line;"></p>').text(e.content))
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