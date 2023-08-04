(function ($) {
    $('pre').each(function (index, codeBlock) {
        var btn = $('<button class="fa fa-clipboard" style="border: none; float: right; background: none"></button>');

        var codes = $(codeBlock).children("code");
        var text;
        if (codes.length === 0) {
            text = codeBlock.innerText;
        } else {
            var code = codes[0];
            // 如果是mermaid图 则不显示复制按钮
            if ($(code).hasClass('language-mermaid')) {
                return;
            }
            text = code.innerText;
        }

        // 添加复制按钮
        $(codeBlock).prepend(btn);

        btn.click(function () {
            window.navigator.clipboard.writeText(text);

            btn.attr('class', 'fa fa-check').css('color', 'green').text('Copied');
            setTimeout(function () {
                btn.attr('class', 'fa fa-clipboard').css('color', '').text('');
            }, 3000);
        });
    });
})(jQuery);