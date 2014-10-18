(function () {
    /**
     * Module Angular principal
     */
    var app = angular.module('tpManager', []);

    /**
     * Controller retournant le contenu du fichier JSON
     */
    app.controller('TpDataCtrl', function($scope, $http) {
        $scope.contents = [];
        var http_get = $http.get('../webTP/data/tpList.json');
        http_get.success(function(data) {
            $scope.contents = data;
        });
    });

    /**
     * Controller dédié à la création d'un nouveau TP,
     * Construit un objet avec les informations entrées dans le formulaire
     * et les push dans le fichier JSON.
     * Non fonctionnel !
     */
    app.controller('NewTpController', function($scope, $http) {
        var currentTime = Date.now().toString();
        $scope.tp = {
            title: "",
            description: "",
            date: currentTime,
            content: ""
        };

        // Fonction appelée lors de l'envoi du formulaire valide
        // Push le contenu de $scope.tp dans le fichier JSON
        this.addTp = function() {
            $scope.tp.title = $('#newTp-name').val();
            $scope.tp.description = $('#newTp-desc').val();
            console.log($scope.tp);

            var http_post = $http.post('../webTP/data/tpList.json', $scope.tp);
            http_post.success(function(data) {
                $scope.message = data;
                var op = {
                    content: "TP créé avec succès !",
                    style: "toast",
                    timeout: 5000
                };
                $.snackbar(op);
            });
            http_post.error(function(data) {
                var op = {
                    content: "POST error : " + JSON.stringify({data: data}),
                    style: "toast",
                    timeout: 5000
                };
                $.snackbar(op);
            });
        }
    });

    /**
     * Filtre destiné au champ de recherche
     * Retourne le contenu filtré à partir du texte recherché (insensible à la casse)
     */
    app.filter('listFilter', [function() {
        return function(items, searchText) {
            var filtered = [];

            searchText = searchText.toLowerCase();
            angular.forEach(items, function(item) {
                if(item.title.toLowerCase().indexOf(searchText) >= 0) filtered.push(item);
            });
            return filtered;
        };
    }]);

    app.controller('sectionDisplayController', function($scope) {

        $scope.sections = [
            true,
            false,
            false
        ];

        $scope.getDisplay = function(i) {
            return $scope.sections[i];
        };

        $scope.displaySection = function(i) {
            $scope.sections[i] = true;
            for(var j = 0;j < $scope.sections.length; j++) {
                if(j != i) {
                    $scope.sections[j] = false;
                }
            }
        };
    });
})();