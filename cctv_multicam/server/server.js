const app = require('express')()
const PORT = 3000
const waits = []

app.get('/srv', (request, response) => {
   const sid = request.query.sid
   const sdp = request.query.sdp
   console.log('SRV: sid = ' + sid + ', sdp = ' + sdp)
   if (sid) { // ответ на клиентский запрос
      const i = waits.findIndex(v => v.sid === sid && v.side === 'cli')
      if (i >= 0) {
         const wait = waits[i]
         wait.response.send({sid, sdp})
         waits.splice(i,1)
         response.send({ok: true})
      } else { // клиент отвалился, ждем может еще придет
         add_wait('srv', undefined, sdp, request, response)
      }
   } else { // обслуживание новых клиентов
      add_wait('srv', undefined, sdp, request, response)
      try_match()
   }
})

app.get('/cli', (request, response) => {
   const sid = request.query.sid
   const sdp = request.query.sdp
   console.log('CLI: sid = ' + sid + ', sdp = ' + sdp)
   let i = waits.findIndex(v => v.sid === sid && v.side === 'srv')
   if (i >= 0) {
      const wait = waits[i]
      wait.response.send({sid, sdp})
      waits.splice(i,1)
   } else {
      add_wait('cli', sid, sdp, request, response)
      try_match()
   }
})

function try_match() {
   const isrv = waits.findIndex(v => v.sid === undefined && v.side === 'srv')
   if (isrv >= 0) {
      const srv = waits[isrv]
      const cli = waits.find(v => !v.processing && v.side === 'cli')
      if (cli) {
         cli.processing = true
         srv.response.send({sid: cli.sid, sdp: cli.sdp})
         waits.splice(isrv,1)
      }
   }
}

function add_wait(side, sid, sdp, request, response) {
   response.setHeader('Content-Type', 'application/json; charset=utf-8')
   response.setHeader("Cache-Control", "no-cache, must-revalidate")
   waits.push({side, sid, sdp, response})
   request.on('close', () => {
      const i = waits.findIndex(v => v.response === response)
      if (i >= 0) waits.splice(i,1)
   })
}

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
