const app = require('express')()
const PORT = 3000
const sessions = []

function new_session(sid, sdp, request, response) {
   const ses = {sid, sdp, request, response}
   sessions.push(ses)
   request.on('close', () => {
      const i = sessions.findIndex(v => v.request === request)
      if (i >= 0) {
         console.log('closed: ' + sessions[i].sid);
         del_session(i)
      }
   })
   return ses
}

function del_session(i) {
   //console.log('deleted: ' + sessions[i].sid)
   sessions.splice(i,1)
}

app.get('/', (request, response) => {
   const sid = request.query.sid
   const sdp = request.query.sdp
   console.log('sid = ' + sid + ', sdp = ' + sdp)

   if (sid === 'srv' || sid === 'cli') { // пришел серверный листнер или новый клиент, пробуем сопоставить
      new_session(sid, sdp, request, response)
      const isrv = sessions.findIndex(v => v.sid === 'srv')
      if (isrv >= 0) {
         srv = sessions[isrv]
         const icli = sessions.findIndex(v => v.sid === 'cli')
         if (icli >= 0) {
            cli = sessions[icli]
            const sid_new = Math.random()
            srv.response.send({sid: sid_new, sdp: cli.sdp})
            cli.response.send({sid: sid_new, ok: true})
            del_session(isrv)
            del_session(icli)
         }
      }
   } else { // пришел серверный или клиентский запрос в рамках существующей сессии
      const i = sessions.findIndex(v => v.sid === sid)
      if (i === -1) { // другая сторона неготова принять, ждем
         new_session(sid, sdp, request, response)
      } else { // запросы клиента и сервера сопоставлены, определяем направление данных
         ses = sessions[i]
         if (sdp) {
            ses.response.send({sid, sdp})
            response.send({sid, ok: true})
         } else if (ses.sdp) {
            response.send({sid, sdp: ses.sdp})
            ses.response.send({sid, ok: true})
         }
         del_session(i)
      }
   }
})

app.listen(PORT,() => {
   console.log('Signaling server running on port ' + PORT)
})

/*
let url = require('url');
let querystring = require('querystring');
let static = require('node-static');

let fileServer = new static.Server('.');

let subscribers = Object.create(null);

function onSubscribe(req, res) {
  let id = Math.random();

  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader("Cache-Control", "no-cache, must-revalidate");

  subscribers[id] = res;

  req.on('close', function() {
    delete subscribers[id];
  });

}

function publish(message) {

  for (let id in subscribers) {
    let res = subscribers[id];
    res.end(message);
  }

  subscribers = Object.create(null);
}

function accept(req, res) {
  let urlParsed = url.parse(req.url, true);

  // новый клиент хочет получать сообщения
  if (urlParsed.pathname == '/subscribe') {
    onSubscribe(req, res);
    return;
  }

  // отправка сообщения
  if (urlParsed.pathname == '/publish' && req.method == 'POST') {
    // принять POST
    req.setEncoding('utf8');
    let message = '';
    req.on('data', function(chunk) {
      message += chunk;
    }).on('end', function() {
      publish(message); // опубликовать для всех
      res.end("ok");
    });

    return;
  }

  // остальное - статика
  fileServer.serve(req, res);

}

function close() {
  for (let id in subscribers) {
    let res = subscribers[id];
    res.end();
  }
}

// -----------------------------------

if (!module.parent) {
  http.createServer(accept).listen(8080);
  console.log('Server running on port 8080');
} else {
  exports.accept = accept;

  if (process.send) {
     process.on('message', (msg) => {
       if (msg === 'shutdown') {
         close();
       }
     });
  }

  process.on('SIGINT', close);
}
*/
