'use strict';

var Bluebird = require('bluebird');

var unauthorisedError = new Error();
unauthorisedError.response = { status: 401 };

var timeoutError = new Error();
timeoutError.response = { status: 504 };

var unavailableError = new Error();
unavailableError.response = { status: 503 };

var notFoundError = new Error();
notFoundError.response = { status: 404 };

module.exports = {
    mockImplicitGrantFlow: mockImplicitGrantFlow,
    mockAuthCodeFlow: mockAuthCodeFlow,
    slowAuthCodeFlow: slowAuthCodeFlow,
    unauthorisedError: unauthorisedError,
    timeoutError: timeoutError,
    notFoundError: notFoundError,
    unavailableError: unavailableError
};

function mockImplicitGrantFlow() {
    var fakeToken = 'auth';

    return {
        getToken: function() { return fakeToken; },
        authenticate: function() {},
        refreshToken: function () { return false; }
    };
}

function mockAuthCodeFlow() {
    var fakeToken = 'auth';

    return {
        getToken: function() { return fakeToken; },
        authenticate: function() { throw new Error('Cannot authenticate'); },
        refreshToken: function() {
            fakeToken = 'auth-refreshed';
            return Bluebird.resolve();
        }
    };
}

function slowAuthCodeFlow() {
  var fakeToken = null;
  var refreshCount = 0;

  return {
      getToken: function() { return fakeToken; },
      authenticate: function() {},
      refreshToken: function() {
          return new Bluebird(function (resolve) {
              setTimeout(function () {
                  refreshCount++;
                  fakeToken = 'auth-refreshed-' + refreshCount;
                  resolve();
              }, 1000);
          });
      }
  };
}
