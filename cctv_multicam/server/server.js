const app = require('express')()
const PORT = 3000
const sessions = []

function new_session(sid, data, request, response) {
   const ses = {sid, data, request, response}
   sessions.push(ses)
   request.on('close', () => {
      const i = sessions.findIndex(v => v.request === request)
      if (i >= 0) {
         del_session(i)
         console.log('closed: ' + request.url)
      }
   })
   return ses
}

function del_session(i) {
   sessions.splice(i,1)
}

function send(res, body) {
   res.setHeader('Content-Type', 'application/json; charset=utf-8')
   res.setHeader("Cache-Control", "no-cache, must-revalidate")
   res.setHeader("Access-Control-Allow-Origin", "*")
   res.send(body)
}

app.get('/', (request, response) => {
   const sid = request.query.sid
   const data = request.query.data
   console.log('sid = ' + sid + ', data = ' + data)

   if (sid === 'srv' || sid === 'cli') { // пришел серверный листнер или новый клиент, пробуем сопоставить
      new_session(sid, data, request, response)
      const isrv = sessions.findIndex(v => v.sid === 'srv')
      if (isrv >= 0) {
         srv = sessions[isrv]
         const icli = sessions.findIndex(v => v.sid === 'cli')
         if (icli >= 0) {
            cli = sessions[icli]
            const sid_new = Math.random()
            send(cli.response, {sid: sid_new, ok: true})
            send(srv.response, {sid: sid_new, data: cli.data})
            del_session(icli)
            del_session(isrv)
         }
      }
   } else { // пришел серверный или клиентский запрос в рамках существующей сессии
      const i = sessions.findIndex(v => v.sid === sid)
      if (i === -1) { // другая сторона неготова принять, ждем
         new_session(sid, data, request, response)
      } else { // запросы клиента и сервера сопоставлены, определяем направление данных
         ses = sessions[i]
         if (data) {
            send(ses.response, {sid, data})
            send(response, {sid, ok: true})
         } else if (ses.data) {
            send(response, {sid, data: ses.data})
            send(ses.response, {sid, ok: true})
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
