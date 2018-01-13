// import 'babel-polyfill'
import { playerRequest } from './utils'
import { stats_ptsd } from './data.js'

var count = 0;

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

// 并发执行抓取
async function main() {

  // 用于存放所有请求返回的Promise
  var promiseList;

  // 球员列表（数组）
  var players = stats_ptsd.data.players;
  // 补全所有球员的信息
  promiseList = players.map( ( player ) => {

    // 返回promise
    return complementPlayerInfo( player );

  } );

  await Promise.all( promiseList );

  console.log( 'done' );

}

main();
