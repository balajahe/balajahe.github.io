(async () => {
   const imap = require('imap-simple')
   const spars = require('mailparser').simpleParser
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
   const conn = await imap.connect(config)
   await conn.openBox('INBOX')
   const msgs = await conn.search(['ALL'], {bodies: [''], markSeen: false })
   msgs.forEach(msg => {
      spars('Imap-Id: ' + msg.attributes.uid + '\r\n' + msg.parts[0].body, (err, mail) => {
         console.log(mail.subject)
         console.log(mail.html.slice(0,100))
      });
   })
})()
