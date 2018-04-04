var hasDecided = false;
var timerObj;

function timerStart () {
    timerObj = new Date();
}

function timerEnd () {
    var endTime = new Date();
    var delta = endTime.getTime() - timerObj.getTime();
    return delta;
}

var generateInputTimeout;
$('#generate-input').on('keyup keydown paste', function () {
    var url = $(this).val();
    var out = $('#generate-output');

    clearTimeout(generateInputTimeout);

    if (url) {
        generateInputTimeout = setTimeout(function () {
            var img = new Image();
            img.onload = function () {
                $(out).val(window.location.href + '?url=' + encodeURIComponent(url));
            };
            img.onerror = function () {
                $(out).val('Error parsing URL as image');
            };
            img.src = url;
        }, 800);
    }

}).trigger('keyup');

new ClipboardJS('[data-clipboard-target="#generate-output"]');

if (/\?url=/.test(window.location.href)) {
    $('#generate-container').addClass('d-none');
    $('#reaction-container').removeClass('d-none');

    $('#reaction-container').dragend({
        direction: 'horizontal',
        page: 2,
        onSwipeEnd: function () {
            if (!hasDecided && this.page != 1) {
                hasDecided = true;

                var deltaTime = timerEnd();
                $('.reaction-time').text(deltaTime);

                $(this.activeElement).siblings().addClass('inactive');
                this.destroy();
            }
        },
        afterInitialize: function () {
            $('#reaction-container').removeClass('invisible');
            timerStart();
        },
    });

    var url = decodeURIComponent(window.location.href.split('?')[1].replace(/^url=/, ''));
    var img = new Image();

    img.onload = function () {
        var main = $('#reaction-main');
        var mainCount = 3;
        var imgLoadInterval;

        function countDownImgLoad () {
            $(main).html('Get ready to swipe! <br> In ' + mainCount + ' seconds...');
            mainCount--;

            if (mainCount < 0) {
                clearInterval(imgLoadInterval);
                $(main).empty().append(
                    '<img class="img-fluid" src="' + img.src + '">'
                );
                timerStart();
            }
        }
        countDownImgLoad();

        imgLoadInterval = setInterval(countDownImgLoad, 1000);
    };
    img.onerror = function () {
        $('#reaction-main').text('Error parsing URL as image');
    };
    img.src = url;
}
