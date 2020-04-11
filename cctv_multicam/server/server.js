const app = require('express')()
const PORT = 3000
const sessions = []

function new_session(side, sid, data, request, response) {
   const ses = {side, sid, data, request, response}
   sessions.push(ses)
   request.on('close', () => {
      const i = sessions.findIndex(v => v.request === request)
      if (i >= 0) {
         del_session(i)
         console.log('closed: ' + request.url.slice(0,120).replace(/\r\n/g, ' '))
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
   body.ip = res.socket.remoteAddress
   res.send(body)
}

app.get('/', (request, response) => {
   const side = request.query.side
   const sid = request.query.sid
   const data = request.query.data
   console.log(`side = ${side}, ip = ${request.ip}, sid = ${sid}, data = ${data ? data.slice(0,120).replace(/\r\n/g, ' ') : ''}`)

   if (!sid) { // пришел серверный листнер или новый клиент, пробуем сопоставить
      new_session(side, sid, data, request, response)
      const isrv = sessions.findIndex(v => v.side === 'srv' && !v.sid)
      if (isrv >= 0) {
         srv = sessions[isrv]
         const icli = sessions.findIndex(v => v.side === 'cli' && !v.sid)
         if (icli >= 0) {
            cli = sessions[icli]
            const sid_new = Math.random()
            send(cli.response, {sid: sid_new, ok: true})
            send(srv.response, {sid: sid_new, data: cli.data})
            del_session(icli)
            del_session(isrv)
            console.log('DELIVERED !')
         }
      }
   } else { // пришел серверный или клиентский запрос в рамках существующей сессии
      const i = sessions.findIndex(v => v.side !== side && v.sid === sid && (!v.data && data || !data && v.data))
      if (i === -1) { // другая сторона не готова принять, ожидаем
         new_session(side, sid, data, request, response)
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
         console.log('DELIVERED !')
      }
   }
})

app.listen(PORT,() => {
   console.log('Signaling server running on port ' + PORT)
})
