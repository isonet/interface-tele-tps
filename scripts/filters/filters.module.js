(function () {

    "use strict";
    var app = angular.module('tpManager.filters', []);

    /**
     * Filtre destiné au champ de recherche
     * Retourne le contenu filtré à partir du texte recherché (insensible à la casse)
     */
    app.filter('listFilter', [function () {
        return function (items, searchText) {
            if(items !== undefined && searchText !== undefined) {
                var filtered = [];

                searchText = searchText.toLowerCase();

                angular.forEach(items, function (item) {
                    if (item.title.toLowerCase().indexOf(searchText) >= 0) {
                        filtered.push(item);
                    }
                });
                return filtered;
            } else {
                return items;
            }
        };
    }]);

}());