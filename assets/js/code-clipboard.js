$(document).ready(function () {
    function generateUniqueIdentifier() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 10);
    }

    $('pre').each(function (index, codeBlock) {
        var text,
            codes = $(codeBlock).find('code').first(),
            code = codes.length ? codes : undefined,
            uuid = generateUniqueIdentifier();
        var copyBtn = $('<button class="fa fa-clipboard" style="border: none; float: right; background: none"></button>'),
            fullBtn = $('<button class="fa fa-expand" style="border: none; float: right; background: none"></button>');
        // 不存在code节点或者是mermaid图
        if (!code || !code.hasClass('language-mermaid')) {
            text = code ? code.text() : codeBlock.innerText;
            // 添加复制按钮
            $(codeBlock).prepend(copyBtn);
        } else {
            // 添加svg模态框
            var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '<div class="modal-dialog modal-lg" role="document">' +
                '<div class="modal-content" style="min-height: 200px;">' +
                '</div></div>').attr('id', uuid);
            var content = modal.find('.modal-dialog').find('.modal-content');
            var btns = $('<div style="z-index: 10; float: right; position: relative; display: flex; justify-content: flex-end;align-items: flex-start; opacity: .8" aria-label="SVG Controls">' +
                '      <button id="move-up' + uuid + '" class="btn btn-default"><i class="fa fa-arrow-up"></i></button>' +
                '      <button id="move-down' + uuid + '" class="btn btn-default"><i class="fa fa-arrow-down"></i></button>' +
                '      <button id="move-left' + uuid + '" class="btn btn-default"><i class="fa fa-arrow-left"></i></button>' +
                '      <button id="move-right' + uuid + '" class="btn btn-default"><i class="fa fa-arrow-right"></i></button>' +
                '      <button id="reset' + uuid + '" class="btn btn-default"><i class="fa fa-refresh"></i></button>' +
                '      <button id="zoom-in' + uuid + '" class="btn btn-default"><i class="fa fa-search-plus"></i></button>' +
                '      <button id="zoom-out' + uuid + '" class="btn btn-default"><i class="fa fa-search-minus"></i></button>' +
                '    </div>' +
                '<div id="svg' + uuid + '" style="position: fixed; justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; overflow: hidden">' +
                '</div>');
            btns.appendTo(content);
            var s = code.find('svg').first().clone();
            s.attr('name', 'svg' + uuid);
            s.appendTo(modal.find('#svg' + uuid));
            $(codeBlock).append(modal);
            // 添加全屏按钮
            $(codeBlock).prepend(fullBtn);
        }

        copyBtn.click(function () {
            window.navigator.clipboard.writeText(text);

            copyBtn.attr('class', 'fa fa-check').css('color', 'green').text('Copied');
            setTimeout(function () {
                copyBtn.attr('class', 'fa fa-clipboard').css('color', '').text('');
            }, 3000);
        });

        // 全屏开关
        fullBtn.click(function () {
            $('#' + uuid).modal();
        });

        var moveStep = 10, scaleStep = 0.1;
        var scale = 1, translateX = 0, translateY = 0, svg = $('[name="svg' + uuid + '"]');

        $('#move-up' + uuid).click(function () {
            console.info("up");
            move('up');
        });

        $('#move-down' + uuid).click(function () {
            move('down');
        });

        $('#move-left' + uuid).click(function () {
            move('left');
        });

        $('#move-right' + uuid).click(function () {
            move('right');
        });

        $('#zoom-in' + uuid).click(function () {
            zoom('in');
        });

        $('#zoom-out' + uuid).click(function () {
            zoom('out');
        });

        $('#reset' + uuid).click(function () {
            reset();
        });

        function updateTransform() {
            svg.css('transform', 'scale(' + scale + ') translate(' + translateX + 'px, ' + translateY + 'px)')
        }

        function move(direction) {
            switch (direction) {
                case 'up':
                    translateY -= moveStep;
                    break;
                case 'down':
                    translateY += moveStep;
                    break;
                case 'left':
                    translateX -= moveStep;
                    break;
                case 'right':
                    translateX += moveStep;
                    break;
            }
            updateTransform();
        }

        function zoom(zoom) {
            switch (zoom) {
                case 'in':
                    scale += scaleStep;
                    break;
                case 'out':
                    scale -= scaleStep;
                    break;
            }
            updateTransform();
        }

        function reset() {
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        }
    });
});
