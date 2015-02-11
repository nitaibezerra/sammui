'use strict';

angular.module('sammui.apiAuthServices', ['ngResource', 'ngRoute'])

    .service('oAuthSession', function () {

        this.create = function (userInfo) {
            this.autenticated = userInfo.autenticated;
            this.autenticated_fully = userInfo.autenticated_fully;
            this.autenticated_anonymously = userInfo.autenticated_anonymously;
            this.role_user = userInfo.role_user;
            this.role_admin = userInfo.role_admin;
            this.role_anonymous = userInfo.role_anonymous;
            this.client = userInfo.client || null;
            this.username = (userInfo.user) ? userInfo.user.username : null;
            this.email = (userInfo.user) ? userInfo.user.email : null;
            this.roles = (userInfo.user) ? userInfo.user.roles : null;
        };

        this.destroy = function () {
            this.autenticated = null;
            this.autenticated_fully = null;
            this.autenticated_anonymously = null;
            this.role_user = null;
            this.role_admin = null;
            this.role_anonymous = null;
            this.client = null;
            this.username = null;
            this.email = null;
            this.roles = null;
        };

        return this;
    })
    // Resource factories for OAuth API
    .factory('oAuth', ['$http', 'authService', 'oAuthSession', function ($http, authService, oAuthSession) {

        // Sammui client ID and Secret, you should get one with the client:create command at symfony
        // To-do: Where should I store credentials?
        var oAuthClientId = '54d2028ceabc88600a8b4567_qss71wwodiosk84gk4gwwk8s40k48wgg0cgkw8wwkwwgkcg44';
        var oAuthClientSecret = '5o808pbhkw84kcwggocc0ogos8c44socccgc0880koggoc08sk';

        var oAuth = {};

        oAuth.getInfo = function (accessToken, createSession) {
            var userInfo = null;
            createSession = createSession || false;

            $http.get('/api/user/info',
                {
                    access_token: accessToken
                })
                .success(function (data) {
                    userInfo = data;
                    userInfo.access_token = accessToken;

                    if (true === createSession) oAuthSession.create(userInfo);
                });

            return userInfo;
        };

        oAuth.getAnonymous = function () {
            $http.post('/oauth/v2/token',
                {
                    client_id: oAuthClientId,
                    client_secret: oAuthClientSecret,
                    grant_type: 'client_credentials'
                })
                .success(function (data) {
                    oAuth.getInfo(data.access_token, true);

                    authService.loginConfirmed('success', function (config) {
                        config.params = {access_token: data.access_token};
                        return config;
                    });
                })
                .error(function (data, status) {
                    return status;
                });
        };

        return oAuth;

    }])
;