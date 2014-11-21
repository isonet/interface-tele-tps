(function () {

    /**
     * Controllers pour Angular
     */

    "use strict";
    var app = angular.module('tpManager.controllers', []);

    /**
     * Controller retournant le contenu du fichier JSON
     */
    app.controller('TpDataCtrl', function ($scope, $http) {
        $scope.contents = [];

        $scope.get = function (url) {
            loadD3();
            var http_get = $http.get(url);
            http_get.success(function (data) {
                $scope.contents = data;
            });
            http_get.error(function () {
                var link = '<a href="javascript:void(0)" style="text-decoration: none; color: #FFC400; padding-left: 10px;">Réessayer</a>';
                var op = {
                    content: "Erreur de chargement de la liste des TPs ! "+ link,
                    style: "snackbar",
                    timeout: 10000
                };
                $.snackbar(op);
            })
        };

        $scope.get('data/tpList.json');
    });

    /**
     * Controller dédié à la création d'un nouveau TP,
     * Construit un objet avec les informations entrées dans le formulaire
     * et les push dans le fichier JSON.
     * Non fonctionnel !
     */
    app.controller('NewTpController', function ($scope, $http) {
        var currentTime = Date.now().toString();
        $scope.tp = {
            title: "",
            description: "",
            date: currentTime,
            content: ""
        };

        // Fonction appelée lors de l'envoi du formulaire valide
        // Push le contenu de $scope.tp dans le fichier JSON
        this.addTp = function () {
            $scope.tp.title = $('#newTp-name').val();
            $scope.tp.description = $('#newTp-desc').val();
            console.log($scope.tp);

            var http_post = $http.post('../webTP/data/tpList.json', $scope.tp);
            http_post.success(function (data) {
                $scope.message = data;
                var op = {
                    content: "TP \"" + $scope.tp.title + "\" créé avec succès !",
                    style: "toast",
                    timeout: 5000
                };
                $.snackbar(op);
            });
            http_post.error(function (data) {
                var op = {
                    content: "POST error : " + JSON.stringify(data),
                    style: "toast",
                    timeout: 5000
                };
                $.snackbar(op);
            });
        };
    });

    /**
     * Controller dédié à la gestion de l'affichage des différentes
     * sections du site. Apellée au chargement de la page et à la
     * navigation.
     */
    app.controller('sectionDisplayController', function ($scope) {

        $scope.sections = [
            true,
            false,
            false
        ];

        $scope.getDisplay = function (i) {
            return $scope.sections[i];
        };

        $scope.displaySection = function (i) {
            for (var j = 0; j < $scope.sections.length; j++) {
                $scope.sections[j] = false;
            }
            $scope.sections[i] = true;
        };

    });

}());