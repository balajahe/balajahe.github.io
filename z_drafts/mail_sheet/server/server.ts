import * as EXPRESS from 'express'
import * as IMAP from 'imap-simple'
import {simpleParser as mparse} from 'mailparser'

const PORT = 3000
const CFG = {
    imap: {
        user: process.argv[2],
        password: process.argv[3],
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { "servername": "imap.gmail.com" },
        authTimeout: 3000
    }
}

const express = EXPRESS()
let imap = null

express.listen(PORT, async () => {
   imap = await IMAP.connect(CFG)
   await imap.openBox('INBOX')
   console.log('IMAP-REST server running on port ' + PORT)
})

express.get('/all', async (request, response) => {
   response.setHeader('Content-Type', 'application/json; charset=utf-8')
   response.setHeader("Cache-Control", "no-cache, must-revalidate")
   response.setHeader("Access-Control-Allow-Origin", "*")
   const res = []
   const mails = await imap.search(['ALL'], {bodies: [''], markSeen: false })
   for (const mail of mails) {
      const m = await mparse('Imap-Id: ' + mail.attributes.uid + '\r\n' + mail.parts[0].body)
      res.push({
         uid: mail.attributes.uid,
         subject: m.subject,
         html: m.html
      })
   }
   res.reverse()
   response.send(res)
})
