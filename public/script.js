var hasDecided = false;
var timerObj;

$(document.documentElement).pasteImageReader(function (result) {
    console.log(result);
});

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

function timerStart () {
    timerObj = new Date();
}

function timerEnd () {
    var endTime = new Date();
    var delta = endTime.getTime() - timerObj.getTime();
    return delta;
}

$('#inputfile').on('change', function () {
    var file = $(this)[0].files[0];
    var formData = new FormData();
    formData.append('name', 'test.jpg');
    formData.append('file', file);

    $.ajax({
        url: 'https://uguu.se/api.php?d=upload-tool',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data) {
            console.log(data);
        }
    });

});
