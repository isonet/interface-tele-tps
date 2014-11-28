"use strict";

window.ni = undefined;

// TODO Move all these functions in the existing javascript files
// TODO sidebar function can go into the controller and resize as a new directive http://jsfiddle.net/jaredwilli/SfJ8c/
$(document).ready(function (){

    /**
     * Fonction de redimension de certains éléments
     * Appelée au chargement de la page et à chaque redimension
     * de la fenêtre.
     */
    window.resizeElements = function () {
        var appHeight = $(window).height() - 55;
        $('.main-app').css({
            height : appHeight
        });

        // 75 = footer height
        var canvasHeight = appHeight - (90 + 75);
        $('#tpCreatorCanvas').find('#conceptorCanvas').css({
            height: canvasHeight
        });

        var sidebarHeight = canvasHeight+6;
        var sidebarTopMargin = -canvasHeight;
        $('#tpCreatorSideBar').css({
            height: sidebarHeight,
            marginTop: sidebarTopMargin
        });

        var paneHeight = sidebarHeight - 85;
        $('#sidebarTabContents').find('.tab-pane').css({
            height: paneHeight
        });

    };


    /**
     * Liaison de la fonction de redimension à l'évènement de redimension de la fenêtre
     */
    window.onresize = function() {
        resizeElements();
    };




});