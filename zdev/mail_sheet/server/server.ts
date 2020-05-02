import * as EXPRESS from 'express'
import * as IMAP from 'imap-simple'
import {simpleParser as mparse} from 'mailparser'

const PORT = 3000
const express = EXPRESS()
let cfg = {}
let imap = null

express.listen(PORT, async () => {
   console.log('IMAP-REST server running on port ' + PORT)
})

express.get('/login', async (request, response) => {
   cfg = {
      imap: {
         user: request.query.user,
         password: request.query.password,
         host: request.query.server,
         port: 993,
         tls: true,
         tlsOptions: { "servername": request.query.server },
         authTimeout: 3000
      }
   }
   setHeaders(response)
   try {
      imap = await IMAP.connect(cfg)
      await imap.openBox('INBOX')
      response.send({ok: true})
      console.log('LOGGED !')
   } catch(err) {
      imap = null
      response.send({ok: false, err: err.toString()})
      console.log(err)
   }
})

express.get('/get_all', async (request, response) => {
   setHeaders(response)
   if (!imap) {
      const msg = 'NOT LOGGED !'
      response.send([{
         subject: msg,
         text: msg
      }])
      console.log(msg)
   } else {
      const res = []
      const mails = await imap.search(['ALL'], {bodies: [''], markSeen: false})
      for (const mail of mails) {
         const m = await mparse('Imap-Id: ' + mail.attributes.uid + '\r\n' + mail.parts[0].body)
         console.log('=====================================================')
         console.log(m)
         res.push({
            //uid: mail.attributes.uid,
            messageId: m.messageId,
            inReplyTo: m.inReplyTo,
            references: m.references,
            date: m.date,
            from: m.from,
            to: m.to,
            subject: m.subject,
            text: m.text,
            html: m.html
         })
      }
      res.reverse()
      response.send(res)
   }
})

function setHeaders(response) {
   response.setHeader('Content-Type', 'application/json; charset=utf-8')
   response.setHeader("Cache-Control", "no-cache, must-revalidate")
   response.setHeader("Access-Control-Allow-Origin", "*")
}
