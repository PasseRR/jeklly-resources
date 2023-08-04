(function ($) {
    $('pre.highlight').each(function (index, codeBlock) {
        var btn = $('<button class="fa fa-clipboard" style="border: none; float: right; background: none"></button>');
        $(codeBlock).prepend(btn);

        btn.click(function () {
            var code = $(codeBlock).children("code")[0].innerText;
            window.navigator.clipboard.writeText(code);

            btn.attr('class', 'fa fa-check').css('color', 'green').text('Copied');
            setTimeout(function () {
                btn.attr('class', 'fa fa-clipboard').css('color', '').text('');
            }, 3000);
        });
    });
})(jQuery);