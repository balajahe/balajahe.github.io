(async () => {
   const imaps = require('imap-simple')
   const config = {
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
   const conn = await imaps.connect(config)
   await conn.openBox('INBOX')
   const msgs = await conn.search(['ALL'], {bodies: ['TEXT', 'HEADER'], markSeen: false })
   msgs.forEach(msg => {
         console.log(msg.parts[1].body.subject[0])
         //console.log(msg.parts[1])
   })
})()
