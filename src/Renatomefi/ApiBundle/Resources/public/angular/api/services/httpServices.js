'use strict';

angular.module('sammui.apiHttpServices', ['ngResource', 'ngRoute'])

    .filter('loadingProgressBar', function () {
        return function (loadingHttpList, type) {

            var items = loadingHttpList;

            var total = items.length;
            var completedSuccess = 0;
            var completedError = 0;

            angular.forEach(items, function (value, key) {
                if (!angular.isUndefined(value.success)) {
                    if (value.success === true) {
                        completedSuccess++;
                        console.log('completedSuccess');
                    } else {
                        completedError++;
                    }
                }
            });
            return {total: total, completedS: completedSuccess, completedE: completedError};
        }
    })

    .service('loadingHttpList', function () {
        var list = [];
        var history = [];

        var completed = 0;
        var completedError = 0;

        var completedPercent = 0;
        var completedErrorPercent = 0;
        var totalPercent = 0;

        return {
            append: function (config, deferred) {
                list.push({
                    config: config,
                    deferred: deferred
                });
            },
            getItem: function (id) {
                return list[id];
            },
            clear: function () {
                history.concat(list);
                list = [];
            },
            getList: function () {
                return list;
            },
            getHistory: function () {
                return history;
            },
            list: list,
            history: history,
            completed: completed,
            completedError: completedError,
            completedPercent: completedPercent,
            completedErrorPercent: completedErrorPercent,
            totalPercent: totalPercent
        };
    })

    .factory('loadingHttpInterceptor', ['$q', 'loadingHttpList', function ($q, loadingHttpList) {
        return {
            // optional method
            'request': function (config) {
                var deferred = $q.defer();

                loadingHttpList.append(config, deferred);

                config.success = undefined;
                config.loadingStart = (new Date).getTime();
                config.loadingEnd = undefined;

                config.loadingListId = loadingHttpList.getList().length - 1;

                deferred.promise.then(function () {
                    loadingHttpList.completed++;
                    config.success = true;
                }, function () {
                    loadingHttpList.completedError++;
                    config.success = false;
                });

                deferred.promise.finally(function () {
                    config.loadingEnd = (new Date).getTime();
                    loadingHttpList.completedPercent = ((loadingHttpList.completed * 100) / loadingHttpList.getList().length);
                    loadingHttpList.completedErrorPercent = ((loadingHttpList.completedError * 100) / loadingHttpList.getList().length);
                    loadingHttpList.totalPercent = (((loadingHttpList.completed + loadingHttpList.completedError) * 100) / loadingHttpList.getList().length);
                });

                return config;
            },

            // optional method
            'response': function (response) {
                var config = loadingHttpList.getItem(response.config.loadingListId);
                config.deferred.resolve();
                return response;
            },

            // optional method
            'responseError': function (rejection) {
                var config = loadingHttpList.getItem(rejection.config.loadingListId);
                config.deferred.reject();
                return $q.reject(rejection);
            }
        };
    }])
;