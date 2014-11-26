(function () {

    // Controllers pour Angular

    'use strict';
    var app = angular.module('tpManager.directives', []);


    // TODO
    app.directive('bsHasError', [function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs, ctrl) {
                var input = element.find('input[ng-model]');
                if (input) {
                    scope.$watch(function () {
                        return input.hasClass('ng-invalid');
                    }, function (isInvalid) {
                        if(isInvalid) {
                            element.find('div.col-lg-8').addClass('has-error2', isInvalid);
                            element.find('div.form-control-wrapper').addClass('has-error2', isInvalid);
                            element.addClass('has-error2', isInvalid);
                        } else {
                            element.find('div.col-lg-8').removeClass('has-error2', isInvalid);
                            element.find('div.form-control-wrapper').removeClass('has-error2', isInvalid);
                            element.removeClass('has-error2', isInvalid);
                        }
                    });
                }
            }
        };
    }]);

}());