import cheerio from 'cheerio'

/*
  前端异步请求
  @param url 请求地址
  发送get请求
  返回一个Promise对象
  当请求返回结果的时候，promise状态改变
*/
function sendRequest( url ) {
  return new Promise( ( resolve, reject ) => {
    var xhr = new XMLHttpRequest();
    // 设置为'json'后，xhr.response的数据类型就是一个js对象
    xhr.responseType = 'json';

    // 请求方式， 请求地址， 是否异步
    xhr.open( 'GET', url, true );

    // 状态改变的处理函数
    xhr.onreadystatechange = () => { // 或者使用 onload

      if( xhr.readyState !== XMLHttpRequest.DONE ) return;

      // 当请求已经完成
      if( xhr.status === 200 ) {
        resolve( xhr.response );
      } else {
        reject( new Error( xhr.statusText ) );
      }
    }

    // 必须在open之后，send之前调用,（第一个参数大小写不敏感）
    // 指定客户端能够接受的数据类型为json数据
    xhr.setRequestHeader( 'Accept', 'application/json' );

    // 发送请求
    xhr.send();

  } )
}

const http = require( 'http' ); // 不用安装，直接用就行，node的核心模块

/*
  node程序发送get请求，获取.JSON文件
  返回一个promise对象
  @param url string 请求地址
*/
function NodeRequest( url ) {
  return new Promise( ( resolve, reject ) => {

    // http.get和http.request返回的都是http.ClientRequest类型的对象实例，表示一个进行中的请求
    // get是request的简化，使用GET请求，并且不需要调用http.ClientRequest.end
    // 当请求对象收到响应头时发出‘response’事件，意味着将要开始接收响应数据。第二个参数是这个事件的处理函数。此事件只发出一次。
    let req = http.get( url, ( res ) => {

      // response事件处理函数的参数是IncomingMessage的对象实例，可以用于访问响应状态、头和数据

      const { statusCode } = res;
      const contentType = res.headers[ 'content-type' ];
      const isJson = /^application\/json/.test(contentType);

      let error;

      // 如果请求没有成功
      if ( statusCode !== 200 ) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if ( !isJson ) {

        // 如果返回的数据类型不是json数据
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }

      if ( error ) {
        console.error(error.message);

        // 如果出现了错误，重新开始？
        // consume response data to free up memory
        res.resume();
        reject( error );
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';

      // 当一个数据块到达的时候触发。chunk代表一个数据块。一个响应可能有多个数据块
      res.on( 'data', ( chunk ) => {
        rawData += chunk;
      } );

      // 当所有的数据块都接收完毕才会调用
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          // promise状态改变
          resolve( parsedData ); // 将获取到的json数据转换成js对象后，将作为await的返回值
        } catch (e) {
          console.error(e.message);
          reject( e.message );
        }
      });

    })

    req.on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });

  } )
}

/*
  获取单个球员的信息
  @param playerID number
  @return Array 球员的补充信息
*/
async function playerRequest( playerID ) {

  return new Promise( ( resolve, reject ) => {

    var url = `http://stats.nba.com/player/${playerID}`

    // 请求对象接收到响应头的时候触发response事件，第二个参数是这个事件的处理函数
    let req = http.get( url, ( res ) => {

      // response事件处理函数的参数是IncomingMessage的对象实例，可以用于访问响应状态、头和数据

      const { statusCode } = res;
      const contentType = res.headers[ 'content-type' ];
      const isDocument = /^text\/html/.test(contentType);

      let error;

      // 如果请求没有成功
      if ( statusCode !== 200 ) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if ( !isDocument ) {

        // 如果返回的数据类型不是text/html数据
        error = new Error('Invalid content-type.\n' +
                          `Expected text/html but received ${contentType}`);
      }

      if ( error ) {
        console.error(error.message);

        // 如果出现了错误，重新开始？
        // consume response data to free up memory
        res.resume();
        reject( error );
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';

      // 当一个数据块到达的时候触发。chunk代表一个数据块。一个响应可能有多个数据块
      res.on( 'data', ( chunk ) => {
        rawData += chunk;
      } );

      // 当所有的数据块都接收完毕才会调用
      res.on('end', () => {
        try {

          // 补充的信息存放在这里
          let info = [];
          // 将请求得到的html解析成dom
          let $ = cheerio.load( rawData );
          // 国籍
          let prior = $( '.player-stats__prior .player-stats__stat-value' ).html();
          // 获取基本信息。依次是：
          info.push( prior );

          // 释放内存，垃圾回收
          rawData = null;

          resolve( info );

        } catch (e) {
          console.error(e.message);
          reject( e.message );
        }
      });

    })

    req.on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });

  } )
}

export { sendRequest, NodeRequest, playerRequest };
