'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

/*
  @param player Array 数组，数组的每一个元素都是运动员的信息
  补全运动员的信息
*/
var complementPlayerInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(player) {
    var additionInfo;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.playerRequest)(player[0]);

          case 2:
            additionInfo = _context.sent;

            // 将补充信息合并到该运动员数组中（每个运动员用一个数组表示）
            player.push.apply(player, _toConsumableArray(additionInfo));
            count++;
            console.log(additionInfo[0] + ', ' + count);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function complementPlayerInfo(_x) {
    return _ref.apply(this, arguments);
  };
}();

/*
  控制并发
  @param int concurrency 并发的请求数
*/


// 并发执行抓取
var main = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var concurrency;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:

            // 允许的最大并发数
            concurrency = 5;
            _context2.next = 3;
            return progressControllar(concurrency);

          case 3:

            console.log('done');

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function main() {
    return _ref2.apply(this, arguments);
  };
}();

var _utils = require('./utils');

var _data = require('./data.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // import 'babel-polyfill'


// 成功的请求数量
var count = 0;
// 球员列表（数组）
var players = _data.stats_ptsd.data.players;function progressControllar(concurrency) {

  // 当所有的请求都结束的时候，返回的这个promise对象resolve
  return new Promise(function (resolve, reject) {

    var completed = 0; // 已经完成的个数
    var requesting = 0; // 正在执行的请求个数
    var started = 0; // 发出的请求个数

    // replenish是再充满的意思
    (function replenish() {

      if (completed >= players.length) {
        // 当所有的请求都结束
        resolve();
        return;
      }

      // 已经发出的请求个数小于请求总数 && 正在执行的请求个数小于并发最大值
      while (started < players.length && requesting < concurrency) {

        started++;
        requesting++;

        console.log('requesting: ' + requesting);

        // complementPlayerInfo会返回一个Promise
        complementPlayerInfo(players[started - 1]).then(function () {

          // 当一个请求完全执行结束之后
          completed++;
          requesting--;

          // 不要停！保持执行中的请求和并发个数一致
          replenish();
          // setTimeout( 'replenish()', 500 );
        });
      }
    })();
  });
}

main();
//# sourceMappingURL=index.js.map