"use strict";

global.IS_TEST_MODE = true;

// Built-ins
global.Emitter = require("events").EventEmitter;

// Internal
global.Collection = require("../../lib/mixins/collection");
global.within = require("../../lib/mixins/within");
global.five = require("../../lib/johnny-five");
global.EVS = require("../../lib/evshield");


// Third Party (library)
global.converter = require("color-convert");
global.SerialPort = require("serialport");
global.Firmata = require("firmata");
global.temporal = require("temporal");

// Third Party (test)
global.mocks = require("mock-firmata");
global.sinon = require("sinon");


global.MockFirmata = mocks.Firmata;
global.MockSerialPort = mocks.SerialPort;

global.Accelerometer = five.Accelerometer;
global.Animation = five.Animation;
global.Altimeter = five.Altimeter;
global.Barometer = five.Barometer;
global.Board = five.Board;
global.Boards = five.Boards;
global.Button = five.Button;
global.Buttons = five.Buttons;
global.Color = five.Color;
global.Compass = five.Compass;
global.ESC = five.ESC;
global.ESCs = five.ESCs;
global.Expander = five.Expander;
global.Fn = five.Fn;
global.GPS = five.GPS;
global.Gripper = five.Gripper;
global.Gyro = five.Gyro;
global.Hygrometer = five.Hygrometer;
global.IMU = five.IMU;
global.Multi = five.Multi;
global.IR = five.IR;
global.Keypad = five.Keypad;
global.LCD = five.LCD;
global.Led = five.Led;
global.Leds = five.Leds;
global.LedControl = five.LedControl;
global.LedDigits = five.Led.Digits;
global.LedMatrix = five.Led.Matrix;
global.Light = five.Light;
global.Joystick = five.Joystick;
global.Motion = five.Motion;
global.Motor = five.Motor;
global.Motors = five.Motors;
global.Nodebot = five.Nodebot;
global.Piezo = five.Piezo;
global.Ping = five.Ping;
global.Pin = five.Pin;
global.Proximity = five.Proximity;
global.Relay = five.Relay;
global.RGB = five.Led.RGB;
global.RGBs = five.Led.RGB.Collection;
global.Repl = five.Repl;
global.Sensor = five.Sensor;
global.Serial = five.Board.Serial;
global.Servo = five.Servo;
global.Servos = five.Servos;
global.ShiftRegister = five.ShiftRegister;
global.Sonar = five.Sonar;
global.Stepper = five.Stepper;
global.Switch = five.Switch;
global.Thermometer = five.Thermometer;
global.Virtual = five.Board.Virtual;
global.Wii = five.Wii;


// Used for alias tests
global.Analog = five.Analog;
global.Digital = five.Digital;
global.Luxmeter = five.Luxmeter;
global.Magnetometer = five.Magnetometer;


function newBoard(pins) {

  if (pins) {
    pins.forEach(function(pin) {
      Object.assign(pin, {
        mode: 1,
        value: 0,
        report: 1,
        analogChannel: 127
      });
    });
  }

  var io = new MockFirmata({
    pins: pins
  });

  io.SERIAL_PORT_IDs.DEFAULT = 0x08;

  var board = new Board({
    io: io,
    debug: false,
    repl: false
  });

  io.emit("connect");
  io.emit("ready");

  return board;
}

global.newBoard = newBoard;


var digits = {
  all: function(x) {
    return String(x).replace(/\./g, "").length;
  },
  integral: function(x) {
    return String(x).split(".")[0].length;
  },
  fractional: function(x) {
    let parts = String(x).split(".");
    return parts.length < 2 ? 0 : parts[1].length;
  },
};

global.digits = digits;


global.addControllerTest = function(Constructor, Controller, options) {
  return {
    setUp: function(done) {
      this.sandbox = sinon.sandbox.create();
      this.board = newBoard();
      this.Controller = this.sandbox.spy(Board, "Controller");
      this.component = new Constructor(Object.assign({}, options, {
        board: this.board
      }));
      done();
    },

    tearDown: function(done) {
      Board.purge();
      this.sandbox.restore();
      done();
    },

    controller: function(test) {
      test.expect(2);
      // Board.Controller may called more than once, for example: Servo -> Expander
      test.equal(this.Controller.called, true);
      // We can only test for the FIRST call to Board.Controller, since
      // we can't generically know which componant class controllers will
      // instantiate an Expander
      test.equal(this.Controller.firstCall.args[0], Controller);
      test.done();
    },
  };
};
