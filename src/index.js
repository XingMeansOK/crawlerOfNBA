// import 'babel-polyfill'
import { playerRequest } from './utils'
import { stats_ptsd } from './data.js'

// 成功的请求数量
var count = 0;
// 球员列表（数组）
var players = stats_ptsd.data.players;

/*
  @param player Array 数组，数组的每一个元素都是运动员的信息
  补全运动员的信息
*/
async function complementPlayerInfo( player ) {

  // 获取运动员的补充信息
  let additionInfo = await playerRequest( player[0] );
  // 将补充信息合并到该运动员数组中（每个运动员用一个数组表示）
  player.push( ...additionInfo );
  count++;
  console.log( additionInfo[ 0 ] + ', ' + count );

}

/*
  控制并发
  @param int concurrency 并发的请求数
*/
function progressControllar( concurrency ) {

  // 当所有的请求都结束的时候，返回的这个promise对象resolve
  return new Promise( ( resolve, reject ) => {

    var completed = 0; // 已经完成的个数
    var requesting = 0; // 正在执行的请求个数
    var started = 0; // 发出的请求个数

    // replenish是再充满的意思
    ( function replenish() {

      if( completed >= players.length ) {
        // 当所有的请求都结束
        resolve();
        return;
      }

      // 已经发出的请求个数小于请求总数 && 正在执行的请求个数小于并发最大值
      while( started < players.length && requesting < concurrency ) {

        started++;
        requesting++;

        console.log( 'requesting: ' + requesting );

        // complementPlayerInfo会返回一个Promise
        complementPlayerInfo( players[ started - 1 ] ).then( () => {

          // 当一个请求完全执行结束之后
          completed++;
          requesting--;

          // 不要停！保持执行中的请求和并发个数一致
          replenish();

        } )

      }

    } )()
  } )

}

// 并发执行抓取
async function main() {

  // 允许的最大并发数
  const concurrency = 5;
  await progressControllar( concurrency );

  console.log( 'done' );

}

main();
