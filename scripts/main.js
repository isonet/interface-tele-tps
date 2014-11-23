"use strict";

window.ni = new NetworkInterface();
d3.select(window).on('resize', ni.resize());

$(document).ready(function (){

    //ni.load();

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

        // 75 = footer height
        var canvasHeight = appHeight - (90 + 75);
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

        removeAnchor();
        angular.element("#displayController").scope().displaySection(0);
        angular.element("#displayController").scope().$digest();
    });

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
        $("#tpCreatorSideBar").stop().animate({
            marginRight: position+"px"
        },300);
        if(b != window.sidebarIsDisplayed) {
            $("#tpCreatorCanvas").find(".btn-fab").toggleClass('icon-material-add icon-material-close');
            window.sidebarIsDisplayed = !window.sidebarIsDisplayed;
        }
        if(panel == 'settings') {
            $("#settings-panel a").tab('show');
        } else {
            $("#components-panel a").tab('show');
        }
    };

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

    /**
     * Controle de l'affichage des sections en fonction de la navigation
     * Permet de naviguer le site avec les boutons précédents et suivants
     */
    function switchDisplay() {
        var currentItem = window.location.hash.substring(1);
        switch (currentItem) {
            case "list":
                currentItem = 0;
                break;
            case "":
                currentItem = 0;
                break;
            case "new":
                currentItem = 1;
                break;
            case "editor":
                currentItem = 2;
                break;
            default:
                console.log("Incorrect section ID : \"" + currentItem + "\"");
        }
        if (typeof currentItem === "number") {
            angular.element("#displayController").scope().displaySection(currentItem);
            angular.element("#displayController").scope().$digest();
        }
    }

    /**
     * Appel de la fonction switchDisplay au chargement de la page
     * Permet de conserver le même état de la page au rafraichissement
     */
    switchDisplay();

    /**
     * Appel de la fonction switchDisplay à la navigation dans la page
     */
    $(window).on('popstate', function () {
        switchDisplay();
    });

    function removeAnchor() {
        window.location.replace("#");
        if (typeof window.history.replaceState == 'function') {
            history.replaceState({}, '', window.location.href.slice(0, -1));
        }
    }

    /**
     * Suppression du lien ancre de l'URL lors d'un clic sur le logo de la page
     * (retour à l'accueil)
     */
    $('.navbar').find('.navbar-brand').click(function () {
        removeAnchor();
    });

    $("#link_retry").click(function() {
        angular.element("#tpDataDisplayCtrl").scope().get('data/tpList_.json');
        angular.element("#tpDataDisplayCtrl").scope().$digest();
    });

});