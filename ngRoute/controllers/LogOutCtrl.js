
angular.module("app.controllers.logout", [
    "app.services"
])
.controller("LogOutCtrl", function (User, $location) {
    User.role = "guest";
    $location.path("/");
});