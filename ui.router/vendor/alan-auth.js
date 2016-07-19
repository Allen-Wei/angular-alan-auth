
/**
 * @author: Alan Wei
 * @created: 2016-07-19 14:21:18
 * @version: 0.0.1
 * @issues: https://github.com/Allen-Wei/angular-auth/issues
 * 
 * 为 ui-router(https://github.com/angular-ui/ui-router) 设计
 */

(function () {
    angular.module("alan.auth.ui.router", ["ui.router"])
        .factory("AlanAuthUiRouter", function ($location, $state) {
            // utils function
            var isValidString = function (value) {
                return angular.isString(value) && !/^\s*$/g.test(value);
            };

            var isInRoleFn = function (roles, controller) {
                console.info("AlanAuthUiRouter.isInRole: default isInRole function.");
                return true;
            };


            // 角色和控制器名称/URL的映射
            var maps = {
                "state name or path": {
                    roles: [],
                    redirect: function () { }
                }
            };

            var service = {
                version: "0.0.1",
                globalConfigName: "__global0719",
                working: true, //模块是否开始执行的开关

                /**
                 * 判断当前用户是否拥有其中的某个角色,调用参数: isInRole(roles, controllers)
                 * @param {function} isInRole 是否拥有某个角色
                 * @return this
                 * 
                 */
                setIsInRole: function (isInRole) {
                    if (!angular.isFunction(isInRole)) {
                        throw "AlanAuthUiRouter.setIsInRole: isInRole must be a fucntion.";
                    }
                    isInRoleFn = isInRole;
                    return this;
                },

                /**
                 * 添加控制器和角色之间的映射
                 * @param {string[]} stateOrPaths 控制器名称或者页面URL, 可以是字符串或者字符串数组
                 * @param {string[]/function} allowRoles 对应的角色名, 字符串数组或者是个函数(如果是个函数则需要函数自己实现跳转等逻辑)
                 * @param {string/function} redirect 可以是一个字符串或者一个回调函数
                 * @returns AlanAuthUiRouter
                 * 
                 */
                map: function (stateOrPaths, allowRoles, redirect) {

                    //判断是否是空字符串
                    if (isValidString(stateOrPaths)) {
                        stateOrPaths = [stateOrPaths];
                    }

                    //stateOrPaths: 可以是一个表示控制器名称的字符串或者表示URL的字符串, 也可以是同时包含这两种类型的数组
                    if (!angular.isArray(stateOrPaths)) {
                        throw "AlanAuthUiRouter.map: parameter stateOrPaths must be string or an array."
                    }

                    //roles: 可以是一个角色名的字符串或者是一个isRole的函数, 也可以是同时包含这两种的数组
                    if (isValidString(allowRoles) || angular.isFunction(allowRoles)) {
                        allowRoles = [allowRoles];
                    }
                    if (!angular.isArray(allowRoles)) {
                        throw "AlanAuthUiRouter.map: parameter roles must be string or an array."
                    }

                    var redirectFn = undefined;
                    if (isValidString(redirect) || angular.isFunction(redirect)) {
                        redirectFn = redirect;
                        if (isValidString(redirect)) {
                            if (redirect[0] === "#") {
                                redirectFn = function () {
                                    location.href = redirect;
                                };
                            } else if (redirect[0] === "~") {
                                redirectFn = function () {
                                    location.href = redirect.substr(1, redirect.length - 1);
                                }
                            } else {
                                redirectFn = function () {
                                    //$location.path(redirect);
                                    $state.go(redirect);
                                }
                            }
                        }
                    }


                    angular.forEach(stateOrPaths, function (ctrlOrPath) {
                        maps[ctrlOrPath] = maps[ctrlOrPath] || {
                            roles: [],
                            redirect: undefined
                        };
                        angular.forEach(allowRoles, function (allowRole) {
                            maps[ctrlOrPath].roles.push(allowRole);
                        });
                        if (redirectFn) {
                            maps[ctrlOrPath].redirect = redirectFn;
                        }
                    });

                    return this;
                },

                /**
                 * 执行权限校验
                 * @param {object} params {name:状态名称, path:当前页面URL, templateUrl: 当前页面对应的模板的URL}
                 * @returns {} 
                 */
                auth: function (params) {
                    if (!this.working) {
                        return this;
                    }


                    var empty = {
                        roles: [],
                        redirect: undefined
                    };
                    var globalMaps = maps[this.globalConfigName] || empty;
                    var stateMaps = maps[params.name] || empty;
                    var pathMaps = maps[params.path] || empty;

                    var allRoles = globalMaps.roles.concat(stateMaps.roles).concat(pathMaps.roles);
                    var redirect = pathMaps.redirect || stateMaps.redirect || globalMaps.redirect;

                    if (!allRoles.length) {
                        console.info("AlanAuthUiRouter.auth: not found maps.");
                        return this;
                    }
                    if (isInRoleFn(allRoles, params)) {
                        return this;
                    } else {
                        if (angular.isFunction(redirect)) {
                            redirect(params);
                            return this;
                        }
                        console.info("unauth and redirect is undefined.");
                        return this;
                    }

                },

                /**
                 * 获取当前控制新信息
                 * @returns {path: 当前路径, name: 当前状态名称, templateUrl: 当前页面使用的模板URL} 
                 */
                getCurrentParams: function () {
                    var currentPath = $location.path();

                    var params = {
                        path: currentPath,
                        name: $state.current.name,
                        templateUrl: $state.current.templateUrl
                    };
                    return params;
                }
            };
            return service;
        })
        .run(["AlanAuthUiRouter", "$rootScope", "$location", function (AlanAuthUiRouter, $rootScope) {

            /*
             * 
             * state change events:
             * 
             * $stateChangeStart
             * $stateChangeSuccess 
             * 
             */


            //监听状态改变事件
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                var params = AlanAuthUiRouter.getCurrentParams();

                AlanAuthUiRouter.auth(params);
            });


        }]);
})();