define(function (require) {
    var Pid = require('Pid');

    var vehicle = function IPVehicle() {
        console.log('This is inverse pendulum vehicle');
        this.pid = new Pid();
    };

    return vehicle;
});
