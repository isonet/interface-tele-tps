(function () {

    /**
     * Filtres pour Angular
     */

    "use strict";
    var app = angular.module('tpManager.filters', []);

    /**
     * Filtre destiné au champ de recherche
     * Retourne le contenu filtré à partir du texte recherché (insensible à la casse)
     */
    app.filter('listFilter', [function () {
        return function (items, searchText) {
            var filtered = [];

            searchText = searchText.toLowerCase();
            angular.forEach(items, function (item) {
                if (item.title.toLowerCase().indexOf(searchText) >= 0) { filtered.push(item); }
            });
            return filtered;
        };
    }]);

}());