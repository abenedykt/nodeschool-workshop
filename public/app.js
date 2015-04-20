(function() {

    var app = angular.module('app', ['restangular'])
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setRestangularFields({
                id: '_id'
            });
        }]);

    function mainController(Restangular, alertService) {
        var vm = this;
        vm.editedItem = {};
        var restClient = Restangular.all("drones");

        function showError(res) {
            var msg = res.data.message;
            alertService.show('warning', 'Opps!', msg);
        }

        function saveSucces() {
            vm.editedItem = {};
            alertService.show('success', 'Item Created!', 'Item was created!');
            getAllItems();
        }

        vm.save = function(editedItem) {
            restClient.post(editedItem).then(saveSucces, showError);
        };

        function removeSuccess() {
            alertService.show('success', 'Item Removed!', 'Item was removed!');
            getAllItems();
        }

        vm.remove = function(project) {
            project.remove().then(removeSuccess, showError);
        }

        function getAllItems() {
            vm.items = restClient.getList().$object;
        }

        getAllItems();
    }
    mainController.$inject = ['Restangular', 'alertService'];


    function alertService($timeout, $rootScope) {
        var alertTimeout;

        function show(type, title, message, timeout) {
            $rootScope.alert = {
                show: true,
                type: type,
                message: message,
                title: title
            };
            $timeout.cancel(alertTimeout);
            alertTimeout = $timeout(function() {
                $rootScope.alert.show = false;
            }, timeout || 2000);
        }

        return {
            show: show
        }
    }
    alertService.$inject = ['$timeout', '$rootScope'];

    app.controller('mainController', mainController);
    app.factory('alertService', alertService);
}());