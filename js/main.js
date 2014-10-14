$(document).ready(function() {
    "use strict";

    function resizeElements() {
        var appHeight = $(window).height() - 55;
        $(".main-app").css({
            height : appHeight
        });

        var canvasHeight = appHeight - 90;
        $("#tpCreatorCanvas").find("#mainCanvas").css({
            height: canvasHeight
        });

        var sidebarHeight = canvasHeight+6;
        $("#tpCreatorSideBar").css({
            height: sidebarHeight
        });
    }
    resizeElements();

    window.onresize = function() {
        resizeElements();
    };

    var kocurrent = 0;
    var kostring = [
        "Why did you even try this?",
        "All your base are belong to us. Or whatever.",
        "I'm very sorry, but... You're a nerd.",
        "The cake is a lie.",
        "Trapped in a fez factory. Send help.",
        "Fun fact: This is completely useless.",
        "You're wasting your time. Stop this.",
        "Okay, enough. Get back to work.",
        "Still here? Eh I might as well roll with it.",
        "",
        "The previous String was empty.",
        "I did this on purpose, obviously.",
        "\u00af\\_(\u30c4)_\x2F\u00af",
        "Okay seriously, stop.",
        '...'
    ];

    var k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var n = 0;
    $(document).keydown(function (e) {
        if (e.keyCode === k[n++]) {
            if (n === k.length) {
                var op = {
                    content: kostring[kocurrent],
                    style: "snackbar",
                    timeout: 5000
                };
                $.snackbar(op);
                kocurrent = kocurrent < kostring.length-1 ? kocurrent+1 : kostring.length-1;
                n = 0;
            }
        } else {
            n = 0;
        }
    });

    $("#newTp-BTN-cancel").click(function() {
        $('#newTp-name').val('');
        $('#newTp-desc').val('');
    });

    var sidebarIsDisplayed = false;
    $("#tpCreatorCanvas").find(".btn-fab").click(function() {
        var position = sidebarIsDisplayed ? -330 : -16;
        $("#tpCreatorSideBar").stop().animate({
            marginRight: position+"px"
        },300);
        $("#tpCreatorCanvas").find(".btn-fab").toggleClass('icon-material-add icon-material-close');

        sidebarIsDisplayed = !sidebarIsDisplayed;
    });

});