$(document).ready(function() {
    "use strict";

    /**
     * Fonction de redimension de certains éléments
     * Appelée au chargement de la page et à chaque redimension
     * de la fenêtre.
     */
    function resizeElements() {
        var appHeight = $(window).height() - 55;
        $(".main-app").css({
            height : appHeight
        });

        var canvasHeight = appHeight - 90;
        $("#tpCreatorCanvas").find("#conceptorCanvas").css({
            height: canvasHeight
        });

        var sidebarHeight = canvasHeight+6;
        var sidebarTopMargin = -canvasHeight;
        $("#tpCreatorSideBar").css({
            height: sidebarHeight,
            marginTop: sidebarTopMargin
        });

        var paneHeight = sidebarHeight - 85;
        $("#sidebarTabContents").find(".tab-pane").css({
            height: paneHeight
        });
    }

    /**
     *  Appel de la fonction de redimension au chargement de la page
     */
    resizeElements();

    /**
     * Liaison de la fonction de redimension à l'évènement de redimension de la fenêtre
     */
    window.onresize = function() {
        resizeElements();
    };

    /**
     * Remise à zéro du contenu du formulaire lors d'un clic sur annuler
     */
    $("#newTp-BTN-cancel").click(function() {
        $('#newTp-name').val('');
        $('#newTp-desc').val('');
    });

    /**
     * Booléen représentant la position actualle du panneau de l'interface de conception
     * @type {boolean}
     */
    var sidebarIsDisplayed = false;

    /**
     * Fonction permettant d'ouvrir et fermer le panneau de paramètres de l'interface de conception.
     * Permet également de changer l'icône du bouton par une manipulation de classes
     * @param b {boolean}
     */
    function toggleSidebar(b) {
        var position = !b ? -330 : -16;
        $("#tpCreatorSideBar").stop().animate({
            marginRight: position+"px"
        },300);
        if(b != sidebarIsDisplayed) {
            $("#tpCreatorCanvas").find(".btn-fab").toggleClass('icon-material-add icon-material-close');
            sidebarIsDisplayed = !sidebarIsDisplayed;
        }
    }

    /**
     * Liaison de la fonction toggleSidebar() à l'évènement de clic sur le bouton "+"
     */
    $("#tpCreatorCanvas").find(".btn-fab").click(function() {
        toggleSidebar(!sidebarIsDisplayed);
    });

    /**
     * Liaison de la fonction toggleSidebar() à l'évènement de clic sur le canvas de l'interface de conception.
     * Permet de fermer automatiquement le panneau d'édition pour laisser le champ libre.
     */
    $("#mainCanvas").click(function() {
        toggleSidebar(false);
    });

});