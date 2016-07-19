
angular.module("app.controllers.login", [
    "app.services"
])
.controller("LogInCtrl", function (User, $location) {
    this.roles = [{
        name: "员工",
        value: "employee"
    }, {
        name: "经理",
        value: "manager"
    }];
    this.role = this.roles[0];

    this.submit = function () {
        User.role = this.role.value;
        $location.path("/personal");
    }
});
