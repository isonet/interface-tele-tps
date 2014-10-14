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
        $("#tpCreatorCanvas").find("#mainCanvas").css({
            height: canvasHeight
        });

        var sidebarHeight = canvasHeight+6;
        $("#tpCreatorSideBar").css({
            height: sidebarHeight
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
     * Ouverture ou fermeture du panneau lors d'un clic sur le bouton correspondant
     * Cette fonction permet également d'échanger l'icône du bouton par une manipulation de ses classes
     */
    $("#tpCreatorCanvas").find(".btn-fab").click(function() {
        var position = sidebarIsDisplayed ? -330 : -16;
        $("#tpCreatorSideBar").stop().animate({
            marginRight: position+"px"
        },300);
        $("#tpCreatorCanvas").find(".btn-fab").toggleClass('icon-material-add icon-material-close');

        sidebarIsDisplayed = !sidebarIsDisplayed;
    });

});