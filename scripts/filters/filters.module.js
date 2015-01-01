(function () {

    'use strict';
    var app = angular.module('tpManager.filters', []);

    app.filter('resource-location', function() {
        return function(locationKey, itemKey) {
            if (locationKey === 'i18n' && itemKey === 'texts') {
                return 'localization/i18n/texts_:locale.json';
            } else {
                return null;
            }
        }
    });

}());