"use strict";

window.ni = undefined;

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

    /**
     * Booléen représentant la position actuelle du panneau de l'interface de conception
     * @type {boolean}
     */
    window.sidebarIsDisplayed = false;

    /**
     * Fonction permettant d'ouvrir et fermer le panneau de paramètres de l'interface de conception.
     * Permet également de changer l'icône du bouton par une manipulation de classes
     * @param b {boolean}
     */
    window.toggleSidebar = function(b, panel) {
        var position = !b ? -330 : -16;
        $('#tpCreatorSideBar').stop().animate({
            marginRight: position+"px"
        },300);
        if(b != window.sidebarIsDisplayed) {
            $('#tpCreatorCanvas').find('.btn-fab').toggleClass('icon-material-add icon-material-close');
            window.sidebarIsDisplayed = !window.sidebarIsDisplayed;
        }
        if(panel == 'settings') {
            $('#settings-panel a').tab('show');
        } else {
            $('#components-panel a').tab('show');
        }
    };

    /**
     * Liaison de la fonction toggleSidebar() à l'évènement de clic sur le bouton "+"
     */
    $('#tpCreatorCanvas').find('.btn-fab').click(function() {
        toggleSidebar(!sidebarIsDisplayed);
    });

    /**
     * Liaison de la fonction toggleSidebar() à l'évènement de clic sur le canvas de l'interface de conception.
     * Permet de fermer automatiquement le panneau d'édition pour laisser le champ libre.
     */
    $('#mainCanvas').click(function() {
        toggleSidebar(false);
    });


});