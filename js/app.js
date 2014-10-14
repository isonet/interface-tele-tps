(function () {
    var app = angular.module('tpManager', []);

    app.controller('TpDataCtrl', function($scope, $http) {
        $scope.contents = [];
        var http_get = $http.get('../webTP/data/tpList.json');
        http_get.success(function(data) {
            $scope.contents = data;
        });
    });

    app.controller('NewTpController', function($scope, $http) {
        var currentTime = Date.now().toString();
        $scope.tp = {
            title: "",
            description: "",
            date: currentTime,
            content: ""
        };

        this.addTp = function() {
            $scope.tp.title = $('#newTp-name').val();
            $scope.tp.description = $('#newTp-desc').val();
            console.log($scope.tp);

            var http_post = $http.post('../webTP/data/tpList.json', $scope.tp);
            http_post.success(function(data) {
                $scope.message = data;
                var op = {
                    content: "POST successful!",
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
})();