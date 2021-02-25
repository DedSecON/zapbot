const express = require('express')
const mime = require('mime'); 
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { promisify } = require('util');
const cookieParser = require('cookie-parser')
const logger = require('../log/index.js')
var formidable = require('formidable')


var path = require("path")
const bot = require("venom-bot");
const fs = require('fs');

global.client = [];


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())





const db = mysql.createConnection({
   host: process.env.DATATABASE_HOST,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASS,
   database: process.env.DATABASE,
   charset : 'utf8mb4'

});

setInterval(function () {
   db.query('SELECT 1', () =>{
      //console.log("status ok")
   });
}, 5000);

const pool = mysql.createPool({
   host: process.env.DATATABASE_HOST,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASS,
   database: process.env.DATABASE,
   charset : 'utf8mb4'
 });
 
 // ... later
 pool.query('select 1 + 1', (err, rows) => { /* */ });


io.on('connection', socket => {
   // console.log(`Socket conectado: ${socket.id}`);
   //console.log(socket)
   socket.on("enviar mensagem", function(mensagem_enviada, callback){
      
      socket.user = mensagem_enviada
      if (mensagem_enviada.setor == ''){
         mensagem_enviada.setor = "Geral (todos)"
      }
      if (socket.user){
         io.sockets.emit("atendente_online "+mensagem_enviada.chat_id, mensagem_enviada);

         
         console.log("msg", mensagem_enviada.atendente_id); 
         db.query('SELECT * FROM atendente_online WHERE id_usuario = ? AND id_atendente = ?', [mensagem_enviada.user_id, mensagem_enviada.atendente_id], async (error, result) => {
            if (error){
               console.log(error)
               return true;
            }

            console.log("entrou 1")

            if (result[0]){
               console.log("entrou 11", result[0])
               db.query('UPDATE atendente_online SET ? WHERE id_usuario = ? and id_atendente = ?', [ {id_usuario: mensagem_enviada.user_id, id_atendente: mensagem_enviada.atendente_id, 
                  status: "online", setor: mensagem_enviada.setor, atendente_nome: mensagem_enviada.atendente_nome}, mensagem_enviada.user_id, mensagem_enviada.atendente_id] , (error, results) =>{


               })
               
            }else{
               console.log("entrou 12", result[0])
               db.query('INSERT INTO atendente_online SET ?', {id_usuario: mensagem_enviada.user_id, id_atendente: mensagem_enviada.atendente_id, 
                  status: "online", setor: mensagem_enviada.setor, atendente_nome: mensagem_enviada.atendente_nome} , (error, results) =>{
                     if (error){
                        console.log(error)
                        return true;
                     }
                     
                        
                     return true;
                     
               })
            }
         })
      }
   
      callback();
   });

   socket.on("aceitar_chat", function(mensagem_enviada, callback){

      io.sockets.emit("transferencia_chat "+mensagem_enviada.chat_id, mensagem_enviada);
      console.log(socket.user)
      callback();

   })



   socket.on('disconnect', function() {
      console.log('Got disconnect!', socket.user);
      //console.log(socket)
      if (socket.user){
         io.sockets.emit("atendente_offline "+socket.user.chat_id, socket.user);

         db.query('SELECT * FROM atendente_online WHERE id_usuario = ? AND id_atendente', [socket.user.user_id, socket.user.atendente_id], async (error, result) => {
            if (error){
               console.log(error)
               return true;
            }

            console.log("entrou 2")

            if (result[0]){
               db.query('UPDATE atendente_online SET ? WHERE id_usuario = ? and id_atendente = ?', [ {id_usuario: socket.user.user_id, id_atendente: socket.user.atendente_id, 
                  status: "offline"}, socket.user.user_id, socket.user.atendente_id] , (error, results) =>{


               })
               
            }else{
               
               
               db.query('INSERT INTO atendente_online SET ?', {id_usuario: socket.user.user_id, id_atendente: socket.user.atendente_id, 
                  status: "offline"} , (error, results) =>{
                     if (error){
                        console.log(error)
                        return true;
                     }
                     if(!result) {
                        
                        return true;
                     }
               })
            }
         })
      }
     
   });
 })
 server.listen(3000)

exports.enviarmsg = async (req, res, next) => {
   const {contato,mensagem} = req.query;
   
   
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );

       db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], async (error, result) => {
      
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
            
            return next();
         }

         req.user = result[0];
         chat_id = result[0].id + result[0].maskeid;

         //console.log("oi3333")
         
         if (global.client[chat_id]){

            console.log(await global.client[chat_id].getConnectionState());
            await global.client[chat_id].sendText(
               contato+'@c.us', 
               mensagem,
            ).then((result) => {
               console.log('Result: ', result); //return object success
               res.write("Mensagem enviada!")
               res.end()
               
               })
            .catch((erro) => {
               console.error('Error when sending: ', erro); //return object error
               res.write("Erro ao enviar!")
               res.end()
               });
         }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("<a href='/whats'>Clique aqui para configurar o whats</a>")
            res.end()
            console.log("Não configurou o numero")
         }
            
         
        
         
         


      })
   }else{
      console.log(error)
      res.write("erro")
      res.end()
   }

}

exports.mensagem = async (req, res, next) => {
   const {id_usuario,contato,mensagem} = req.query;
   
   
 

       db.query('SELECT * FROM usuarios WHERE id = ?', [id_usuario], async (error, result) => {
      
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
            
            return next();
         }

         req.user = result[0];
         chat_id = result[0].id + result[0].maskeid;

         
         
         if (global.client[chat_id]){

            console.log(await global.client[chat_id].getConnectionState());
            await global.client[chat_id].sendText(
               contato+'@c.us', 
               mensagem,
            ).then((result) => {
               console.log('Result: ', result); //return object success
               res.write("Mensagem enviada!")
               res.end()
               
               })
            .catch((erro) => {
               console.error('Error when sending: ', erro); //return object error
               res.write("Erro ao enviar!")
               res.end()
               });
         }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("Configure o qrcode em: /qrcode/"+id_usuario)
            res.end()
            console.log("Não configurou o numero")
         }        


      })
   
}

exports.getmeses = async (req, res) => {

   const {id_usuario} = req.body;

   var data =[];
   
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        



         db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 1 AND id_usuario = ?', [decoded.id], (error, result) => {

            if (error){
               console.log(error)
               res.write("erro")
               res.end()
            }
            data.push(result[0].mesesCount);
         
            db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 2 AND id_usuario = ?', [decoded.id], (error, result) => {

               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }
               data.push(result[0].mesesCount);

               db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 3 AND id_usuario = ?', [decoded.id], (error, result) => {

                  if (error){
                     console.log(error)
                     res.write("erro")
                     res.end()
                  }
                  data.push(result[0].mesesCount);

                  db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 4 AND id_usuario = ?', [decoded.id], (error, result) => {

                     if (error){
                        console.log(error)
                        res.write("erro")
                        res.end()
                     }
                     data.push(result[0].mesesCount);

                     db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 5 AND id_usuario = ?', [decoded.id], (error, result) => {

                        if (error){
                           console.log(error)
                           res.write("erro")
                           res.end()
                        }
                        data.push(result[0].mesesCount);

                        db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 6 AND id_usuario = ?', [decoded.id], (error, result) => {

                           if (error){
                              console.log(error)
                              res.write("erro")
                              res.end()
                           }
                           data.push(result[0].mesesCount);

                           db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 7 AND id_usuario = ?', [decoded.id], (error, result) => {

                              if (error){
                                 console.log(error)
                                 res.write("erro")
                                 res.end()
                              }
                              data.push(result[0].mesesCount);

                              db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 8 AND id_usuario = ?', [decoded.id], (error, result) => {

                                 if (error){
                                    console.log(error)
                                    res.write("erro")
                                    res.end()
                                 }
                                 data.push(result[0].mesesCount);

                                 db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 9 AND id_usuario = ?', [decoded.id], (error, result) => {

                                    if (error){
                                       console.log(error)
                                       res.write("erro")
                                       res.end()
                                    }
                                    data.push(result[0].mesesCount);

                                    db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 10 AND id_usuario = ?', [decoded.id], (error, result) => {

                                       if (error){
                                          console.log(error)
                                          res.write("erro")
                                          res.end()
                                       }
                                       data.push(result[0].mesesCount);

                                       db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 11 AND id_usuario = ?', [decoded.id], (error, result) => {

                                          if (error){
                                             console.log(error)
                                             res.write("erro")
                                             res.end()
                                          }
                                          data.push(result[0].mesesCount);

                                          db.query('SELECT COUNT(*) AS mesesCount FROM campanhas_enviadas Where MONTH(created_at) = 12 AND id_usuario = ?', [decoded.id], (error, result) => {

                                             if (error){
                                                console.log(error)
                                                res.write("erro")
                                                res.end()
                                             }
                                             data.push(result[0].mesesCount);

                                             
                                             

                                             res.write(JSON.stringify(data))
                                             res.end()

                                             
                              
                                          })
                           
                                       })
                        
                                    })
                     
                                 })
                  
                              })
               
                           })
            
                        })
         
                     })
      
                  })
   
               })

            })
     
         })
      
   }

   
}




exports.enviarwhats = async (req, res, next) => {

   const {id,contato} = req.body;
   
   function replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
      db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
      
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
            
            return next();
         }

         req.user = result[0];
         chat_id = result[0].id + result[0].maskeid;
         // res.write(id)
         // res.end()

         db.query('SELECT * FROM campanhas  WHERE id = ? ', id, async (error,result) => {
            if (error){
               console.log(error)
               res.write("erro")
               res.end()
            }

            
            

            if(!result) {
           
               return next();
            }
            var msg = result[0].mensagem;

            db.query('SELECT * FROM contatos  WHERE celular = ? ', contato, async (error,contatos) => {

               

               if (msg.includes("{nome}")){
               
                  msg = replaceAll(msg, "{nome}", contatos[0].nome)
               }
               
               if (msg.includes("{email}")){
               
                  msg = replaceAll(msg, "{email}", contatos[0].email)
               }

              
               console.log("tipo",result[0].tipo)


               if (result[0].tipo == "imagem") {
                  
                  const teste = enviarImagem(chat_id, contato, result[0].anexo, msg)
                  await teste.then(function(resp){
                     if (resp){
                        logger.info(teste)
                        res.write("Enviado")
                        res.end();
                        return next();
                     }else{
                        res.write("Não enviado")
                        res.end();
                        return next();
                     }
                  });
                  
                  
               
                              
               }
               if (result[0].tipo == "video") {
                  const teste = enviarImagem(chat_id, contato, result[0].anexo, msg)
                  await teste.then(function(resp){
                     if (resp){
                     logger.info(teste)
                        res.write("Enviado")
                        res.end();
                        return next();
                     }else{
                        res.write("Não enviado")
                        res.end();
                        return next();
                     }
                  });
               }
               if (result[0].tipo == "documento") {
                  const teste =  enviarDocumento(chat_id, contato, result[0].anexo, msg)
                  await teste.then(function(resp){
                     if (resp){
                     logger.info(teste)
                        res.write("Enviado")
                        res.end();
                        return next();
                     }else{
                        res.write("Não enviado")
                        res.end();
                        return next();
                     }
                  });
               
               }
               if (result[0].tipo == "") {
                  const teste = enviarTexto(chat_id,contato,msg)
                  await teste.then(function(resp){
                     if (resp){
                        logger.info("resp", resp)
                        res.write("Enviado")
                        res.end();
                        return next();
                     }else{
                        res.write("Não enviado")
                        res.end();
                        return next();
                     }
                  });
               }
                  
                        
            
            
            
            })
            
               
            // res.write(JSON.stringify(result[0].tipo))
            // res.end()
            
            
         })



         // if (enviarImagem(chat_id)){
         //    return next();
         // }

      })
   }
  

}

async function enviarImagem(chat_id,contato,image,mensagem) {

   var fileDir = path.resolve(__dirname, '..') + '/public/uploads/';
   
   
   // const contents = await fs.readFile(fileDir + image, {encoding: 'base64'});
   //console.log(contents)
   console.log(fileDir + image)
   var numero;

   if (contato.includes("@c.us"))
      numero = contato;
   else if (contato.includes("@g.us"))
      numero = contato;
   else 
      numero = contato+"@c.us"

   var resp;
  
   if(fs.existsSync(fileDir+image)) {
      await global.client[chat_id].sendFile(
         numero,
         fileDir + image,
         image,
         mensagem
      ) .then((result) => {
         console.log('Result: ', result); //return object success
         resp = true;
      })
      .catch((erro) => {
         console.error('Error when sending: ', erro); //return object error
         resp =  false;
      });
   }else{
      console.log("erro arquivo");
      resp = false;
   }

   return resp;
  
   
   
   
}

async function listarChats(chat_id){

   if(!global.client[chat_id]){
       console.log("chat fechado")
       return true;
   }
   console.log(global.client[chat_id]);
   const chats = await global.client[chat_id].getAllChats()
   //const teste = await global.client[chat_id].getAllMessagesInChat('556992440668-1526321049@g.us');
   

   return chats;


   
}
async function listarChatsWithMessages(chat_id){

   if(!global.client[chat_id]){
      console.log("chat fechado")
      return true;
   }
   console.log(global.client[chat_id]);
   const chats = await global.client[chat_id].getAllChatsWithMessages()
   //const teste = await global.client[chat_id].getAllMessagesInChat('556992440668-1526321049@g.us');
   

   return chats;


   
}

async function downloadFile(data){

   // if(!global.client[chat_id]){
   //    console.log("oiii")
   //    return true;
   // }

   message = data;

   chat_id = data.chat_id;

   
   
   console.log("arquivo nome",data["id[id]"])
   if (!data["id[id]"]){
      data["id[id]"] = data.id.split('_')[2];
      console.log("entrou nome",data["id[id]"])
   }
   // console.log("22222");
   const buffer = await global.client[chat_id].decryptFile(message);
   // At this point you can do whatever you want with the buffer
   // Most likely you want to write it into a file
   const fileName = data["id[id]"]+`.${mime.extension(message.mimetype)}`;
   var arquivo = '/' + data.chat_id + '/' + data.contato + '/' + fileName;
   fs.mkdir('public/' + data.chat_id + '/' + data.contato, { recursive: true }, (err) => {
      if (err) {
         return arquivo;
      }
      fs.writeFile('public/' + data.chat_id + '/' + data.contato + '/' + fileName, buffer, (err) => {
         if (err) {
            return arquivo;
         }
         return arquivo;
      });
   });
   
   return arquivo;
  


   
}


async function pegarMensagensChat(chat_id, contato){

   // if(!global.client[chat_id]){
   //    console.log("oiii")
   //    return true;
   // }
   //console.log(global.client[chat_id]);
   const msgs = await global.client[chat_id].getAllMessagesInChat(contato, true);
 
   const earlie = await global.client[chat_id].loadEarlierMessages(contato)
   console.log(msgs.length)
  
  
   //const teste = await global.client[chat_id].getAllMessagesInChat('556992440668-1526321049@g.us');
   

   return earlie;


   
}

async function pegarTodasMensagensChat(chat_id, contato){

   const all_msgs = await global.client[chat_id].getAllMessagesInChat(contato);

   return all_msgs;

}

async function enviarDocumento(chat_id,contato,image,mensagem) {

   var fileDir = path.resolve(__dirname, '..') + '/public/uploads/';
   var resp; 
   await global.client[chat_id].sendFile(
      contato+"@c.us",
      fileDir + image,
      image,
      mensagem
   ).then((result) => {
      console.log('Result: ', result); //return object success
      resp =  true;
   })
   .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
      resp = false;
   });
   return resp;
}

async function enviarTexto(chat_id,contato,mensagem) {
   var resp; 
   console.log(mensagem)
   await global.client[chat_id].sendText(
      contato+'@c.us', 
      mensagem,
   ).then((result) => {
      console.log('Result: ', result); //return object success
      resp = result;
   })
   .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
      resp = false;
   });
   return resp;
}

async function checaPerfil(chat_id,contato){
   
   const profile = await global.client[chat_id].getNumberProfile(contato+"@c.us");
  
  if(profile == 404){
     console.log("perfil false")
     return false;
  }else{
      console.log("perfil true")
      return true;
  }
   
  
}


exports.getqr = async (req, res, next) => {
   // console.log(req.cookies);

   var {id_usuario} = req.query;

   console.log(req.query);

   var user_id = 0;

   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
       user_id = decoded.id

   } else if (id_usuario){
      user_id = id_usuario;
   } else {
      
      next();
   }


   try {

      


      db.query('SELECT * FROM usuarios WHERE id = ?', [user_id], (error, result) => {
      
      if (error){
         console.log(error)
      }
      if(!result) {
         return next();
      }

      req.user = result[0];

      var data;
      var array = [];
      

      const options = {
         logQR: false, 
         headless: true, 
         browserArgs: ['--disable-web-security', '--no-sandbox', '--disable-web-security',
         '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
         '--disable-offline-load-stale-cache', '--disk-cache-size=0',
         '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
         '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
         '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
         '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'],
         useChrome: true, 
         autoClose: false, 
         debug: false, 
         devtools: false, 
         disableSpins: true,
         refreshQR: 15000
      };

         
      
      const chat_id = req.user.id+req.user.maskeid;
      
      async function criarSessao(){

         if(!global.client[chat_id]){
            console.log("aui")
            bot.create(chat_id,(base64Qr, asciiQR) => {
               // To log the QR in the terminal
               console.log(asciiQR);
               // console.log(base64Qr);            
               console.log("aqui1");
               // To write it somewhere else in a file
               exportQR(base64Qr, 'public/'+chat_id+'.png');
               
            }, (statusFind) =>{
               console.log(statusFind+'\n\n')
            }, options
            
            ).then((client) => {
              
               start(client);
         
            
            }).catch((erro) => console.log(erro));
         }else{
            if (Object.size(global.client[chat_id]) == 0 ){
               console.log("aui")
               bot.create(chat_id,(base64Qr, asciiQR) => {
                  // To log the QR in the terminal
                  console.log(asciiQR);
                  // console.log(base64Qr);            
                  console.log("aqui1");
                  // To write it somewhere else in a file
                  exportQR(base64Qr, 'public/'+chat_id+'.png');
                  
               }, (statusFind) =>{
                  console.log(statusFind+'\n\n')
               }, options
               
               ).then((client) => {
                  console.log("aqui2");
                  start(client);
            
               
               }).catch((erro) => console.log(erro));
            }else{
               console.log("aui2", chat_id)
               const device = await global.client[chat_id].getHostDevice();
               console.log("device", device);
               // console.log(device.pushname);
               if (!device.wid){
                  bot.create(chat_id,(base64Qr, asciiQR) => {
                     // To log the QR in the terminal
                     console.log(asciiQR);
                     // console.log(base64Qr);            
                     console.log("aqui1");
                     // To write it somewhere else in a file
                     exportQR(base64Qr, 'public/'+chat_id+'.png');
                     
                  }, (statusFind) =>{
                     console.log(statusFind+'\n\n')
                  }, options
                  
                  ).then((client) => {
                     console.log("aqui2");
                     start(client);
               
                  
                  }).catch((erro) => console.log(erro));
               }else{
                  const user2 = await global.client[chat_id].getProfilePicFromServer(device.wid.user+"@c.us");
                  console.log(user2);         
                  data = {id: user_id, nome: device.pushname, numero: device.wid.user, image: user2}
                  array.push(data)
                  req.data = array;
                  return next();
               }
            }

         }
      }
      criarSessao();
      
      // Writes QR in specified path
      function exportQR(qrCode, path) {
         qrCode = qrCode.replace('data:image/png;base64,', '');
         const imageBuffer = Buffer.from(qrCode, 'base64');
         console.log("----------------------");
         // Creates 'marketing-qr.png' file
         fs.writeFileSync(path, imageBuffer);
                     
      }
      
      async function start(client) {
         global.client[chat_id] = client;

         //const chats = await global.client[chat_id].getAllGroups();
         
         //const members = await client.getGroupMembersIds('556992353545-1401220068@g.us')
         //console.log("group",chats[0].name);
         //console.log("members", members)

        
         const device = await global.client[chat_id].getHostDevice();

         
         var obj = {};
         var bot = {};
         var status = {}

         Object.assign(status, {status: "parado"});
         Object.assign(bot, {bot: status});
         Object.assign(obj, bot);
         
         global.client[chat_id].onAck(ack => {
            console.log("ackiton",ack)
            io.sockets.emit("ackiton "+chat_id, ack);
         });
         global.client[chat_id].onStateChange((state) => {
            console.log('State changed: ', state);
            // force whatsapp take over
            //if ('CONFLICT'.includes(state)) client.useHere();
            // detect disconnect on whatsapp
            //if ('UNPAIRED'.includes(state)) console.log('logout');
          });
         Object.assign(global.client[chat_id], obj);
        
         console.log("chat_id", chat_id);
         console.log("device.wid", device.wid);

         

         const user2 = await client.getProfilePicFromServer(device.wid.user+"@c.us");
         
         console.log(global.client[chat_id]);
         var stage = [];
         global.client[chat_id].onMessage(async (message) => {
            // if (message.isMedia === true || message.isMMS === true) {
            //    const buffer = await global.client[chat_id].decryptFile(message);
            //    // At this point you can do whatever you want with the buffer
            //    // Most likely you want to write it into a file
            //    const fileName = `some-file-name.${mime.extension(message.mimetype)}`;
            //    await fs.writeFile('public/'+fileName, buffer, (err) => {
            //       if(err) {
            //          return console.log(err);
            //      }
            //       console.log("The file was saved!");
            //    });
            //  }
            

            console.log("msg",message);

            io.sockets.emit("atualizar "+chat_id, message); 
            
            console.log(global.client[chat_id].bot.status)
            
            if (global.client[chat_id].bot.status == "iniciado" ){
               if (message.isGroupMsg){
                  return true;
               }
               
               var id = message.from.replace('@c.us','');
               console.log(id);
               if (!stage[id]){
                  stage[id] = 1;
               }else{
                  console.log("stage", stage[id])
               }

               if (message.body.toLowerCase().includes("sair")){
                  stage[id] = 5;
               }
               if (message.body.toLowerCase().includes("finalizar")){
                  stage[id] = 5;
               }
               
               

               db.query('SELECT * FROM bot WHERE id_usuario = ? AND stage = ?', [user_id, stage[id]], async (error, result) => {
                  console.log("aqu1");
                  if (!result){
                     stage[id] = 3;
                     
                     db.query('SELECT * FROM bot WHERE id_usuario = ? AND stage = ?', [user_id, stage[id]], async (error, result) => {
                        var msg = result[0].mensagem;
                        console.log("aqui")
                        stage[id] = "4";
                        
                        await global.client[chat_id].sendText(
                           message.from, 
                           msg,
                        )
                     })
                  }else{
                     if (stage[id] == "4"){
                        db.query('SELECT * FROM bot WHERE id_usuario = ? AND gatilho = ?', [user_id, message.content], async (error, result) => {
                           if (!result[0]){
                              stage[id] = 3;
                              
                              db.query('SELECT * FROM bot WHERE id_usuario = ? AND stage = ?', [user_id, stage[id]], async (error, result) => {
                                 var msg = result[0].mensagem;
                                 stage[id] = "4";
                                 if (msg){
                                    await global.client[chat_id].sendText(
                                       message.from, 
                                       msg,
                                    )
                                 }
                              })

                           }
                           else{
                              var msg = result[0].mensagem;
                              
                              stage[id] = "4";
                              if (stage[id] == "3"){
                                 stage[id] = +3 + +1;
                              }
                              var tipo = result[0].tipo;
                              if (tipo == "texto") {
                                 await global.client[chat_id].sendText(
                                    message.from, 
                                    msg,
                                 )
                              }else{
                                 var image = result[0].anexo.replace("/uploads/", "");
                                 var contato = message.from.replace("@c.us", "")
                                 enviarImagem(chat_id,contato,image, msg)
                              }
                           }
                           
                           
                        })

                     }else{

                        
                        console.log("aqu2");
                  
                        var msg = result[0].mensagem;

                        console.log(msg);
                        stage[id] = +stage[id] + +1;
                        if (stage[id] == "3"){
                           stage[id] = +3 + +1;
                        }

                        if (stage[id] == "6"){
                           stage[id] = "1";
                        }
                        if (msg){
                           await global.client[chat_id].sendText(
                              message.from, 
                              msg,
                           )
                        }
                     }
                  }
                     
               })
                 
            }
            
            
         });
         
        
         
         data = {id: user_id, nome: device.pushname, numero: device.wid.user, image: user2}
         array.push(data)
         req.data = array;
         return next();
      }
      // return next();
   

      
      });
   } catch (err) {
      return next();
   }
  
 };

 exports.iniciarbot = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
      db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
      
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
            
            return next();
         }

         req.user = result[0];
         chat_id = result[0].id + result[0].maskeid;

         

         if (global.client[chat_id]){

           
            
           if (global.client[chat_id].bot.status == "parado"){
               global.client[chat_id].bot.status = "iniciado";
               console.log(global.client[chat_id].bot.status)
               res.write("iniciado")
               res.end()
           }else{
               global.client[chat_id].bot.status = "parado";
               console.log(global.client[chat_id].bot.status)
               res.write("parado")
               res.end()
           }
         }

      })
   }

 }

 Object.size = function(obj) {
   var size = 0, key;
   for (key in obj) {
       if (obj.hasOwnProperty(key)) size++;
   }
   return size;
};

 exports.bot = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
      db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
            
            return next();
         }

         req.user = result[0];
         var chat_id = result[0].id + result[0].maskeid;

         db.query('SELECT * FROM bot  WHERE id_usuario = ?  ORDER BY id ASC', [decoded.id], async (errors,results) => {
            if (errors){
               console.log(error)
               res.write("erro")
               res.end()
            }
            
            console.log(chat_id)
            req.bot = results;
            
            
            if (global.client[chat_id]){
               
              
              
               if (Object.size(global.client[chat_id]) > 0 ){
                  req.data = 'ok';
                  req.status = global.client[chat_id].bot.status;
               }else{
                  req.status = "parado";
                  req.data = 'nao';
               
               }
              return next();
            }else{
               req.status = "parado";
               req.data = 'nao';
               return next();
            }
           

         });

        

      })
   }else{
      req.data = 'nao';
      return next();
   }

 }
 

 exports.checaenviar = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
      db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
      
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
            
            return next();
         }

         req.user = result[0];
         chat_id = result[0].id + result[0].maskeid;

         

         if (global.client[chat_id]){
            req.data = 'ok';

            db.query('SELECT contatos.id,contatos.nome,contatos.celular,contatos.id_grupo, contatos.id_usuario, grupos.nome_grupo FROM contatos  INNER JOIN grupos ON (contatos.id_grupo=grupos.id) WHERE contatos.id_usuario = ? ', [decoded.id], async (errors,results) => {
               if (errors){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }
               

               req.gruposinner = results;
               
                db.query('SELECT * FROM grupos WHERE id_usuario = ?', [decoded.id], async (error,result) => {
                  if (error){
                     console.log(error)
                     res.write("erro")
                     res.end()
                  }
                  
                  req.grupos = result;
                  db.query('SELECT * FROM campanhas  WHERE id_usuario = ? ', [decoded.id], async (error,result) => {
                     if (error){
                        console.log(error)
                        res.write("erro")
                        res.end()
                     }
      
                     
      
                     if(!result) {
                    
                        return next();
                     }
                     
                     req.campanhas = result;
                     return next();
                     
                  })
                  
               })

            });
         }else{
            req.data = 'nao';
            return next();
         }

      })
   }

 }

 


exports.isLoggedIn = async (req, res, next) => {
   // console.log(req.cookies);


   if (req.cookies.jwt) {
     
     try {
       // 1) verify token
       const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
 
       logger.info({jwt_usuario: decoded})
      

            
       // 2) Check if user still exists
      db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         // console.log(result)
         
         if (error){
            console.log(error)
            return next();
         }
         if(!result) {
           
           return next();
         }
         // THERE IS A LOGGED IN USER
         req.user = result[0];
         
         logger.info({login_usuario: req.user})
         

         db.query('SELECT * FROM grupos WHERE id_usuario = ?', [decoded.id], (error, result) => {
            // console.log(result)
            
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              
              return next();
            }
            
            req.grupos = result.length;

            db.query('SELECT * FROM contatos WHERE id_usuario = ?', [decoded.id], (error, result) => {
               // console.log(result)
               
               if (error){
                  console.log(error)
                  return next();
               }
               if(!result) {
                 
                 return next();
               }
   
               req.contatos = result.length;
               db.query('SELECT * FROM campanhas_enviadas WHERE enviado=1 AND id_usuario = ?', [decoded.id], (error, result) => {
                  // console.log(result)
                  
                  if (error){
                     console.log(error)
                     return next();
                  }
                  if(!result) {
                    
                    return next();
                  }
      
                  req.enviadas = result.length;
                  db.query('SELECT * FROM campanhas_enviadas WHERE erro=1 AND id_usuario = ?', [decoded.id], (error, result) => {
                     // console.log(result)
                     
                     if (error){
                        console.log(error)
                        return next();
                     }
                     if(!result) {
                       
                       return next();
                     }
         
                     req.pendentes = result.length;
                     return next(); 
                     
                  });
                  
               });
               
            });
            
         });
         
         
         
        
       });
     } catch (err) {
      console.log(err);
      res.status(400).redirect("/entrar")
     }
   } else {
      res.status(200).redirect("/entrar")
   }
 };

exports.isAtendenteLogin = async (req, res, next) => {
   const chat_id = req.params.chatid;
   console.log(chat_id)

   var sql = 'SELECT * FROM usuarios WHERE LOCATE(maskeid,"' + chat_id + '") > 0 ';
   try{
      db.query(sql,  async (error, result) => {
        
         if (error){
            console.log(error)
         }
         if(!result) {
           return next();
         }

         // console.log(global.gclient[chat_id])
         
         req.user = result[0];
         var data;
         var array = [];
         if (req.user){
            db.query('SELECT * FROM setores WHERE id_usuario = ?', req.user.id, async (error, result) => {
               if (error){
                  console.log(error)
               }
               if(!result) {
               return next();
               }
               
               req.setores = result;
               if (global.client[chat_id]){
                  const device = await global.client[chat_id].getHostDevice();
                  // console.log(device.me.user);
                  // console.log(device.pushname);
                  if (device.wid){
                     const user2 = await global.client[chat_id].getProfilePicFromServer(device.wid.user+"@c.us");
                     console.log(user2);         
                     data = {nome: device.pushname, numero: device.wid.user, image: user2}
                     array.push(data)
                     req.data = array;
                  }
               }
               

               if (req.cookies.jwtatendente) {

                 
                  if (req.cookies.jwtatendente == "loggedout"){
                     return next();
                  }
                  const decoded = await promisify(jwt.verify)(
                     req.cookies.jwtatendente,
                     process.env.JWT_SECRET
                  );
                  console.log("jwt",decoded)
                  db.query('SELECT * FROM atendentes WHERE id = ?', [decoded.id], (error, result) => {
                     // console.log(result)
                     
                     if (error){
                        console.log(error)
                     }
                     if(!result) {
                        return next();
                     }
                     // THERE IS A LOGGED IN USER
                     req.atendente_user = result[0];
                     req.atendente_setor = decoded.id_setor

                     

                     for (let index = 0; index < req.setores.length; index++) {
                        if (req.setores[index].id == decoded.id_setor){
                           req.nome_setor = req.setores[index].setor
                        }
                        
                     }
                     
                     
                     
                     return next();
                  
                  });

               }else{
                  return next();
               }
           
            })
         }else{
            return next();
         }

      })
   } catch (err) {
      return next();
   }

}

 exports.getUserById = async (req, res, next) => {

   id_usuario = req.params.id;
   db.query('SELECT * FROM usuarios WHERE id = ?', [id_usuario], (error, result) => {
         
            
      if (error){
         console.log(error)
         return next();
      }
      if(!result) {
        
        return next();
      }
   
      req.user = result[0];
      return next();
   })

 }

 exports.getcontatos = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
         db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         
            
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              
              return next();
            }
         
            req.user = result[0];
            
            db.query('SELECT contatos.id,contatos.email,contatos.nome,contatos.celular,contatos.id_grupo, contatos.id_usuario, grupos.nome_grupo FROM contatos  INNER JOIN grupos ON (contatos.id_grupo=grupos.id) WHERE contatos.id_usuario = ? ORDER BY contatos.created_at DESC', [decoded.id], async (error,result) => {
               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }
               
               req.contatos = result;
               db.query('SELECT * FROM grupos WHERE id_usuario = ?', [decoded.id], async (error,result) => {
                  if (error){
                     console.log(error)
                     res.write("erro")
                     res.end()
                  }
                  
                  req.grupos = result;
                  return next();
                  
               })
               
            })
         })
         
   } else {
      res.status(200).redirect("/entrar")
   }

}
 exports.getadmin = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
         db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         
            
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              
              return next();
            }
         
            req.user = result[0];
            
            db.query('SELECT * FROM usuarios ', [], async (error,result2) => {
               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }  

               
               if (result[0].admin == 1){
               
                  req.admins = result2;
               }
               
               return next();
                  
               
               
            })
         })
         
   } else {
      res.status(200).redirect("/entrar")
   }

}

exports.getgrupos = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
         db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         
            
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              
              return next();
            }
         
            req.user = result[0];
            
            db.query('SELECT * FROM grupos WHERE id_usuario = ?', [decoded.id], async (error,result) => {
               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }
               
               req.grupos = result;
               return next();
               
            })
         })
         
   } else {
      res.status(200).redirect("/entrar")
   }

}
 
 exports.logout = (req, res) => {
   res.cookie('jwt', 'loggedout', {
     expires: new Date(Date.now() + 10 * 1000),
     httpOnly: true
   });
   res.status(200).redirect("/");
 };

exports.register = (req, res) => {
   // console.log(req.body);

   function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
   
   const maskeid = makeid(6);


   const {nome, senha, email, confirma_senha } = req.body

   db.query('SELECT email FROM usuarios WHERE email= ?', [email], async (error, results) =>{
      if(error){
         console.log(error)
      }
      if (results.length > 0){
         return res.render("cadastro", {
            message: 'Email já existe'
         })
      }else if (senha !== confirma_senha){
         return res.render("cadastro", {
            message: 'Senha não confere com a confirmação'
         })
      }

      let hashSenha = await bcrypt.hash(senha, 8);
      
      db.query('INSERT INTO usuarios SET ?', {nome: nome, senha: hashSenha, email: email, maskeid: maskeid}, (error, results) =>{
         if (error){
            console.log(error)
         }else{
            db.query('SELECT id FROM usuarios WHERE email = ?', [email], (error, result) => {
               if (error){
                  console.log(error)
               }
               // console.log(result)
               const id = result[0].id;
               // console.log(id);
               const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                 expiresIn: process.env.JWT_EXPIRES_IN
               });
     
               const cookieOptions = {
                 expires: new Date(
                   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                 ),
                 httpOnly: true
               };
               res.cookie('jwt', token, cookieOptions);
     
               res.status(201).redirect("/");
             });
         }
      })

      
   })

   
   
}
exports.addusuario = (req, res) => {
   // console.log(req.body);

   function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
   
   const maskeid = makeid(6);


   const {user_nome, user_senha, user_email, user_confirma_senha } = req.body

   db.query('SELECT email FROM usuarios WHERE email= ?', [user_email], async (error, results) =>{
      if(error){
         console.log(error)
      }
      if (results.length > 0){
         
            res.write('Email já existe');
            res.end()
            return true;
         
      }else if (user_senha !== user_confirma_senha){
         
         res.write('Senha não confere com a confirmação')
         res.end()
         return true;
      }

      let hashSenha = await bcrypt.hash(user_senha, 8);
      
      db.query('INSERT INTO usuarios SET ?', {nome: user_nome, senha: hashSenha, email: user_email, maskeid: maskeid}, (error, results) =>{
         if (error){
            console.log(error)
         }else{
            db.query('SELECT id FROM usuarios WHERE email = ?', [user_email], (error, result) => {
               if (error){
                  console.log(error)
               }
               // console.log(result)
               const id = result[0].id;
               console.log(id);
               res.write('ok')
               res.end();
               return true;
             });
         }
      })

      
   })

   
   
}
exports.atendentelogin = async (req, res) => {

   const {login, senha, id_setor} = req.body;

   console.log("oi")

   if (!login || !senha){
      res.write('erro');
      res.end();
      return true;
      
   }

   db.query('SELECT * FROM atendentes WHERE login = ? AND senha = ?', [login, senha], async (error,results) => {
      // console.log(results)


      if (error){
         console.log(error)
         res.write(error)
         res.end();
         return true;
      }
      if (results.length == 0 ){
         res.write('login');
         res.end();
         return true;
      }

      

      const id = results[0].id;
      const setor = id_setor;

      db.query('SELECT * FROM atendente_setor WHERE id_atendente = ? AND id_setor = ?', [id, id_setor], async (error,results) => {

         if (error){
            console.log(error)
            res.write(error)
            res.end();
            return true;
         }
         console.log("resultado:",results)
         if (results.length == 0 ){
            res.write('setor');
            res.end();
            return true;
         }
      
         const token = jwt.sign({id, id_setor }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
         })

         // console.log("token", token)

         const cookieOptions = {
            expires: new Date(
               Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
         }

         res.cookie('jwtatendente', token, cookieOptions)

         res.write("ok");
         res.end();
         return true;

      })
      
   })


}
exports.atendentelogout = (req, res) => {
   const {chat_id} = req.query;
   res.cookie('jwtatendente', 'loggedout', {
     expires: new Date(Date.now() + 10 * 1000),
     httpOnly: true
   });
   res.status(200).redirect("/chat/"+chat_id);

   
};


exports.login = async (req, res) => {

   try {
            
      const {email, senha} = req.body;

      if (!email || !senha){
         return res.status(400).render('entrar', {
            message: 'Por favor informe o email e senha'
         })
      }

      db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error,results) => {
         // console.log(results)
         if (results.length == 0 ){
            return res.status(401).render('entrar', {
               message: "Email ou senha inválidos"
            })
         }

         if (!results || !(await bcrypt.compare(senha, results[0].senha))){
            return res.status(401).render('entrar', {
               message: "Email ou senha inválidos"
            })
         }

         const id = results[0].id;
         const token = jwt.sign({id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
         })

         // console.log("token", token)

         const cookieOptions = {
            expires: new Date(
               Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
         }

         res.cookie('jwt', token, cookieOptions)
         res.status(200).redirect("/")
      })

   } catch (error) {
      console.log("oi");
      res.status(200).redirect("/entrar")
   }
}

exports.sendarquivos = async (req, res) => {
   var form = new formidable.IncomingForm();

   await fs.mkdir( path.resolve(__dirname, '..') + '/public/uploads/tmp/', { recursive: true }, (err) => {

   })
   form.uploadDir = path.resolve(__dirname, '..') + '/public/uploads/tmp/';
   var filename 
   form.on('fileBegin', function(name, file) {
      filename = Date.now()+file.name
      file.path = form.uploadDir +  filename;
      console.log(filename)
      filename = "tmp/"+ filename;
   });

   form.parse(req, async (err, fields, files) => {
      console.log('fields:', fields);
      console.log('files:', files);

      const {chat_id, contato, legenda} = fields;
      const enviar = await enviarImagem(chat_id, contato, filename, legenda)
      
      res.write("ok")
      res.end();

   })

}

exports.addcampanha = async (req, res) => {
   var form = new formidable.IncomingForm();

   
   
   form.uploadDir = path.resolve(__dirname, '..') + '/public/uploads/';
   var filename 
   form.on('fileBegin', function(name, file) {
      filename = Date.now()+file.name
      file.path = form.uploadDir +  filename;
      console.log(filename)
   });

  
   

   form.parse(req, (err, fields, files) => {

      logger.info({CAMPOS_addcamapnha: fields})
      logger.info({ARQUIVOS_addcamapnha: files})
     
      const {campanha, mensagem_campanha,tipo, id_usuario,id_grupo} = fields;
   
      db.query('INSERT INTO campanhas SET ?', {campanha: campanha, mensagem: mensagem_campanha, 
         tipo: tipo, id_usuario: id_usuario, id_grupo: id_grupo, anexo: filename} , (error, results) =>{
   
         if (error){
            console.log(error)
            res.write(error)
            logger.error({error_addcampanha: error, body: fields})
         }else{
            logger.info({sucesso_addcampanha: results, body: fields})
            res.write("ok")
            res.end()
         }
      })

    
   })
      
}
   
   


exports.addgrupo = async (req, res, next) => {

   const {nome_grupo, descricao, usuario_id} = req.body;
   
   db.query('INSERT INTO grupos SET ?', {nome_grupo: nome_grupo, descricao: descricao, 
      id_usuario: usuario_id} , (error, results) =>{

      if (error){
         console.log(error)
         res.write(error)
         logger.error({error_addgrupo: error, body: req.body})
      }else{
         logger.info({sucesso_addgrupo: results, body: req.body})
         res.write("ok")
         res.end()
      }
   })
     

  
   
}

exports.addsetor = async (req, res, next) => {

   const {setor, id_usuario} = req.body;
   
   db.query('INSERT INTO setores SET ?', {setor: setor, id_usuario: id_usuario} , (error, results) =>{

      if (error){
         console.log(error)
         res.write(error)
      }else{
         res.write("ok")
         res.end()
      }
   })
     
 
}

exports.editsetor = async (req, res) => {

   const {setor, id_usuario, id_setor} = req.body;
   
   // console.log(id_usuario, id_setor)

   db.query('UPDATE setores SET ? WHERE id = ? and id_usuario = ?', [ {setor: setor} , id_setor, id_usuario] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }
   })


}


exports.deletarsetor = async (req, res) => {

   const {setor, id_usuario, id_setor} = req.body;
   

   db.query('DELETE FROM setores  WHERE id = ?', [id_setor] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }

   
   })


}

exports.deletaratendente = async (req, res) => {

   const {id_atendente} = req.body;
   

   db.query('DELETE FROM atendentes  WHERE id = ?', [id_atendente] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }

   
   })


}

exports.addatendentesetor = async (req, res, next) => {
   
   const {id_setor, id_atendente, id_usuario } = req.body

   db.query('INSERT INTO atendente_setor SET ? ', {
      id_setor: id_setor,
      id_atendente: id_atendente,
      id_usuario: id_usuario,
   }, (error, result) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }
      
      res.write(JSON.stringify("ok"))
      res.end() 
      

   })
}

exports.addatendente = async (req, res, next) => {
   
   
   const {nome_atendente, login_atendente,senha_atendente, id_usuario } = req.body
   db.query('SELECT login FROM atendentes WHERE login= ? AND user_id = ?', [login_atendente, id_usuario], async (error, results) =>{
      if(error){
         console.log(error)
         res.write(error);
         res.end()
         return next();
      }
      if (results.length > 0){
         
         res.write(JSON.stringify('existe'));
         res.end()
         return next();
         
      }

      db.query('INSERT INTO atendentes SET ?', {
            nome: nome_atendente, 
            login: login_atendente,
            senha: senha_atendente,
            user_id: id_usuario
         } , (error, results) =>{

         if (error){
            console.log(error)
            res.write(error)
         }
      
         res.write(JSON.stringify(results.insertId))
         res.end() 
      
      })
   })
   
 
     
 
}

exports.enviadas = async (req, res, next) => {

   const {enviado, erro, id_usuario} = req.body;
   
   db.query('INSERT INTO campanhas_enviadas SET ?', {enviado: enviado, erro: erro, 
      id_usuario: id_usuario} , (error, results) =>{

      if (error){
         console.log(error)
         res.write(error)
      }else{
         res.write("ok")
         res.end()
      }
   })
     

  
   
}


exports.editgrupo = async (req, res) => {

   const {nome_grupo,descricao, usuario_id, id_grupo} = req.body;

   console.log(req.body)
   

   db.query('UPDATE grupos SET ? WHERE id = ?', [ {nome_grupo: nome_grupo, descricao: descricao, 
      id_usuario: usuario_id} , id_grupo] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }
   })


}

exports.mudarusuario = async (req, res) => {

   const {id_usuario, admin} = req.body;
   

   db.query('UPDATE usuarios SET ? WHERE id = ?', [ {admin: admin} , id_usuario] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }
   })
}

exports.editusuario = async (req, res) => {

   const {user_nome, user_senha, user_email, user_confirma_senha, id_usuario } = req.body
   

   if (!user_senha){
      
   

      db.query('UPDATE usuarios SET ? WHERE id = ?', [ {nome: user_nome, email: user_email} , id_usuario] , (error, results) =>{

         if (error){
            console.log(error)
            res.write("erro")
            res.end()
         }else{
            console.log("ok1")
            res.write("ok")
            res.end()    
            return true;
         }
      })
   }else{

      if (user_senha !== user_confirma_senha){
         
         res.write('Senha não confere com a confirmação')
         res.end()
         return true;
      }

      let hashSenha = await bcrypt.hash(user_senha, 8);
      

      db.query('UPDATE usuarios SET ? WHERE id = ?', [ {nome: user_nome, senha: hashSenha, email: user_email} , id_usuario] , (error, results) =>{

         if (error){
            console.log(error)
            res.write("erro")
            res.end()
         }else{
            console.log("ok")
            res.write("ok2")
            res.end()    
         }
      })
   }
}
exports.deletargrupo = async (req, res) => {

   const {id_grupo} = req.body;
   

   db.query('DELETE FROM grupos  WHERE id = ?', [id_grupo] , (error, results) =>{

      if (error){
         logger.info({erro_deletargrupo: error, body: req.body})
         res.write("erro")
         res.end()
      }else{
         logger.info({sucesso_deletargrupo: results, body: req.body})
         res.write("ok")
         res.end()    
      }

   
   })


}

exports.deletarusuario = async (req, res) => {

   const {id_usuario} = req.body;
   

   db.query('DELETE FROM usuarios  WHERE id = ?', [id_usuario] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }

   
   })


}

exports.deletarwhats= async (req, res) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
         );
         Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
               if (obj.hasOwnProperty(key)) size++;
            }
            return size;
      };

      const id_usuario = decoded.id;
      const {maskeid} = req.body;

      
      // console.log(chat_id)
      if (global.client[maskeid]){
         console.log(global.client[maskeid].length);
         console.log(maskeid)
         global.client[maskeid].close();
         global.client[maskeid]= {};
        
         
      }
      var fileDir = path.resolve(__dirname, '..') + '/tokens/'+maskeid+'.data.json';
      if(fs.existsSync(fileDir)) {
         fs.unlink(fileDir, (err) => {
            if (err) {
               console.error(err)
               res.write(err)
               res.end()
               return
            }
            
            res.write("ok")
            res.end()
         
            //file removed
         })
      } else {
            res.write("Erro")
            res.end()
      }
   }
   
}



exports.deletarcampanha = async (req, res) => {

   const {id_campanha} = req.body;
   db.query('SELECT * FROM campanhas  WHERE id = ? ', id_campanha, async (error,result) => {
      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }

      
      anexo = result[0].anexo

      var fileDir = path.resolve(__dirname, '..') + '/public/uploads/'+anexo;

      fs.unlink(fileDir, (err) => {
         if (err) {
           console.error(err)
           
         }
       
         //file removed
       })

       

       db.query('DELETE FROM campanhas  WHERE id = ?', [id_campanha] , (error, results) =>{

         if (error){
            console.log(error)
            res.write("erro")
            res.end()
         }else{
            logger.info({sucesso_deletarcampanha: result})
            res.write("ok")
            res.end()    
         }
      })
   

      
   })

   

}

exports.addresposta = async (req, res, next) => {

   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
         );
         Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
               if (obj.hasOwnProperty(key)) size++;
            }
            return size;
      };

      const id_usuario = decoded.id;

      var form = new formidable.IncomingForm();
   
      form.uploadDir = path.resolve(__dirname, '..') + '/public/uploads/';
      var filename 
      form.on('fileBegin', function(name, file) {
         if (file.name != ""){
            filename = Date.now()+file.name
            file.path = form.uploadDir +  filename;
            filename = '/uploads/' +  filename;
            console.log(filename)
         }else{
            filename = "";
         }
      });
   
      form.parse(req, (err, fields, files) => {
         console.log('fields:', fields);
         console.log('files:', files);

         var {stage, mensagem, gatilho,tipo} = fields;

         if (tipo == ""){
            tipo = "texto";
         }

         if (filename == ""){
            tipo = "texto";
         }
   
         db.query('SELECT * FROM bot WHERE id_usuario = ? AND gatilho= ? ', [id_usuario, gatilho], (error, result) => {
            if (error){
               console.log(error)
               res.write(error)
            }

            if (result.length > 0){
                  db.query('UPDATE bot SET ? WHERE id_usuario = ? AND gatilho= ? ', [ {stage: stage,anexo: filename, gatilho: gatilho, mensagem: mensagem, tipo: tipo, id_usuario: id_usuario},  id_usuario, gatilho], (error, result) => {
                     if (error){
                        console.log(error)
                        res.write(error)
                     }
                     res.write("ok")
                     res.end();
                  })
            }else{
               db.query('INSERT INTO bot SET ? ', [ {stage: stage,anexo: filename, gatilho: gatilho, mensagem: mensagem,tipo: tipo, id_usuario: id_usuario}], (error, result) => {
                  if (error){
                     console.log(error)
                     res.write(error)
                  }
                  res.write("ok")
                     res.end();
               })
            }
         })

      })


   }
}
exports.chat = async (req, res,next) => {
   const {chat_id} = req.query;
   console.log("aaaaaaaaaaaaa", chat_id)
   const chats = await listarChats(chat_id);   
   const chats2 = await listarChatsWithMessages(chat_id);   
   
   data = {chat1: chats, chat2: chats2};

   
   res.write(JSON.stringify(data));
   res.end();
   return next();
}



exports.chat2 = async (req, res,next) => {
   const {chat_id, contato} = req.body;
   
   const data =  await pegarMensagensChat(chat_id, contato)
   
   
   res.write(JSON.stringify(data));
   res.end();
   return next();
}

exports.sendseen = async (req, res,next) => {
   const {chat_id, contato} = req.body;
   if (global.client[chat_id]){
      console.log("simmmmm")
      const data =  await global.client[chat_id].sendSeen(contato);
      res.write(JSON.stringify(data));
      res.end();
      return next();
   }else{
      console.log("naooooooooooooo")
      res.write("error")
      res.end();
      return next();
   }
    
}

exports.enviartexto = async (req, res,next) => {
   const {chat_id, msg, contato} = req.body;
   console.log("bode",req.body)
   if (global.client[chat_id]){
      console.log("enviou")
      const data =  await global.client[chat_id].sendText(contato, msg)
         .then((result) => {
            console.log('Result: ', result); //return object success
            res.write(JSON.stringify(result));
            res.end();
            return next();
         })
         .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
            console.log(erro)
            res.write("error")
            res.end();
            return next();
         });
      
   }else{
      console.log("naooooooooooooo")
      res.write("error")
      res.end();
      return next();
   }
    
}

exports.downloadfile = async (req, res,next) => {
   const {chat_id, mensagem} = req.body;

   console.log(req.body.chat_id)
   console.log("111111111");
   const arquivo =  await downloadFile(req.body).then((result) => {
      console.log('Result: ', result); //return object success
      
      res.write(JSON.stringify(result));
      
      res.end();
      return next();
   })
   .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
      res.write(JSON.stringify("erro"));
      
      res.end();
      return next();
   });
   
  
      

}

exports.getfotocontato = async (req, res,next) => {
   const {chat_id, contato} = req.body;
   console.log(contato);
   if (global.client[chat_id]){
      const user2 = await global.client[chat_id].getProfilePicFromServer(contato);
      const data = {url: user2}
      console.log("url",data);
      res.write(JSON.stringify(data));
      res.end();
      return next();
   }else{
      res.write("erro");
      res.end();
      return next();
   }
   
   
}

exports.excluirresposta = async (req, res, next) => {

   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
         );
         Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
               if (obj.hasOwnProperty(key)) size++;
            }
            return size;
      };

      const id_usuario = decoded.id;

      const {gatilho} = req.body;

      db.query('DELETE FROM bot  WHERE id_usuario = ? AND gatilho = ?', [id_usuario, gatilho] , (error, results) =>{

         if (error){
            console.log(error)
            res.write("erro")
            res.end()
         }else{
            res.write("ok")
            res.end()    
         }
      })
   }
}

exports.addbot = async (req, res, next) => {

   if (req.cookies.jwt) {

   const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
      );
      Object.size = function(obj) {
         var size = 0, key;
         for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
         }
         return size;
   };

   const id_usuario = decoded.id;
   

   req.body = JSON.parse(JSON.stringify(req.body));
   
      
   

   var size = Object.size(req.body);
   console.log(size);
   console.log(req.body)
   for (let index = 0; index < size; index++) {
         const stage = Object.values(req.body)[index];
         index++;
         const gatilho = Object.values(req.body)[index];
         index++;
         const mensagem = Object.values(req.body)[index];
         db.query('SELECT * FROM bot WHERE id_usuario = ? AND gatilho= ? ', [id_usuario, gatilho], (error, result) => {
            if (error){
               console.log(error)
               res.write(error)
            }

            if (result.length > 0){
                  db.query('UPDATE bot SET ? WHERE id_usuario = ? AND gatilho= ? ', [ {stage: stage, gatilho: gatilho, mensagem: mensagem, id_usuario: id_usuario},  id_usuario, gatilho], (error, result) => {
                     if (error){
                        console.log(error)
                        res.write(error)
                     }
                     
                  })
            }else{
               db.query('INSERT INTO bot SET ? ', [ {stage: stage, gatilho: gatilho, mensagem: mensagem, id_usuario: id_usuario}], (error, result) => {
                  if (error){
                     console.log(error)
                     res.write(error)
                  }
                  
               })
            }

         })

      
   }

   res.write("ok")
   res.end()
   }
  
}


exports.addcontato = async (req, res, next) => {

   const {nome,celular, email, usuario_id, id_grupo} = req.body;
   console.log(id_grupo)
   

   db.query('SELECT * FROM contatos WHERE id_usuario = ? AND celular= ?', [usuario_id, celular], (error, result) => {
      
      if(error){
         console.log(error)
         return next();
      }
      
      
      
      if (result){
         console.log("resutl", result)

         console.log("id_grupo", id_grupo)
         
         if (result.length > 0){
            var id_contato  = result[0].id;
            console.log("id_contato", id_contato)
            db.query('UPDATE contatos SET ? WHERE id = ?', [{nome: nome, celular: celular, 
               email: email, id_usuario: usuario_id, id_grupo: id_grupo}, id_contato]  , (error, results) =>{
         
              
               if (error){
                  console.log(error)
                  res.write(error)
                  return next();
               }else{
                  console.log("UPDATE", nome, celular, email, usuario_id, id_grupo, id_contato)
                  res.write("ok")
                  res.end()
                  return next();
               }
            })
         }else{
            db.query('INSERT INTO contatos SET ?', {nome: nome, celular: celular, 
               email: email, id_usuario: usuario_id, id_grupo: id_grupo} , (error, results) =>{
         
               if (error){
                  console.log(error)
                  res.write(error)
                  return next();
               }else{
                  res.write("ok")
                  res.end()
                  return next();
               }
            })
         }
      }


     

   })
   
}



exports.editcontato = async (req, res) => {

   const {nome,celular, email, usuario_id, id_contato, id_grupo} = req.body;
   
   console.log(req.body)

   db.query('UPDATE contatos SET ? WHERE id = ?', [ {nome: nome, celular: celular, 
      email: email, id_usuario: usuario_id, id_grupo: id_grupo} , id_contato] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }
   })


}

exports.deletarcontato = async (req, res) => {

   const {id_contato} = req.body;
   

   db.query('DELETE FROM contatos  WHERE id = ?', [id_contato] , (error, results) =>{

      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }else{
         res.write("ok")
         res.end()    
      }
   })


}




exports.register = (req, res) => {
   // console.log(req.body);

   function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
   
   const maskeid = makeid(6);


   const {nome, senha, email, confirma_senha } = req.body

   db.query('SELECT email FROM usuarios WHERE email= ?', [email], async (error, results) =>{
      if(error){
         console.log(error)
      }
      if (results.length > 0){
         return res.render("cadastro", {
            message: 'Email já existe'
         })
      }else if (senha !== confirma_senha){
         return res.render("cadastro", {
            message: 'Senha não confere com a confirmação'
         })
      }

      let hashSenha = await bcrypt.hash(senha, 8);
      
      db.query('INSERT INTO usuarios SET ?', {nome: nome, senha: hashSenha, email: email, maskeid: maskeid}, (error, results) =>{
         if (error){
            console.log(error)
         }else{
            db.query('SELECT id FROM usuarios WHERE email = ?', [email], (error, result) => {
               if (error){
                  console.log(error)
               }
               // console.log(result)
               const id = result[0].id;
               // console.log(id);
               const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                 expiresIn: process.env.JWT_EXPIRES_IN
               });
     
               const cookieOptions = {
                 expires: new Date(
                   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                 ),
                 httpOnly: true
               };
               res.cookie('jwt', token, cookieOptions);
     
               res.status(201).redirect("/");
             });
         }
      })

      
   })

   
   
}

exports.getcampanhas = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
       db.query('SELECT * FROM grupos WHERE id_usuario = ?', [decoded.id], async (error,result) => {
         if (error){
            console.log(error)
            res.write("erro")
            res.end()
         }
         
         req.grupos = result;
         db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              return next();
            }
         
            req.user = result[0];
            
            db.query('SELECT * FROM campanhas  WHERE id_usuario = ? ', [decoded.id], async (error,result) => {
               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }

               

               if(!result) {   
                  return next();
               }
               
               req.campanhas = result;
               return next();
               
            })
         })
         
      })
         
   } else {
      res.status(200).redirect("/entrar")
   }

}
exports.getonline = async (req, res, next) => {

   const {id_usuario } = req.body

   console.log("id_usuario", id_usuario)
         
   db.query('SELECT * FROM atendente_online WHERE id_usuario = ? and status="online"', [id_usuario], (error, result) => {
   
      
      if (error){
         console.log(error)
         return next();
      }
      if(!result) {
         
         return next();
      }
   
      req.user = result;
      
      
      res.write(JSON.stringify(result));
      res.end();
      return next();
         
      
   })

}

exports.permissoes = async (req, res, next) => {

   const {id_usuario, id_atendente, id_setor } = req.body

   db.query('SELECT * FROM atendente_permissao WHERE id_usuario = ? AND id_atendente = ? AND id_setor = ?', [id_usuario,  id_atendente, id_setor], async (error, result) => {
      if (error){
         console.log(error)
         res.write("erro");
         res.end();      
         return next();
      }
      if(!result) {
         console.log("aquiiiii")
         return next();
      }
      res.write(JSON.stringify(result));
      res.end();      
      return next();

   })

}







exports.aceitarchat = async (req, res, next) => {

   const {id_usuario, id_atendente, id_setor,contato } = req.body

   
   db.query('SELECT * FROM atendente_permissao WHERE id_usuario = ? AND contato = ?', [id_usuario,  contato], async (error, result) => {
      if (error){
         console.log(error)
         res.write("erro");
         res.end();      
         return next();
      }

     

      if (result[0]){
         
         db.query('DELETE FROM atendente_permissao WHERE id_usuario = ? AND contato = ?', [id_usuario,  contato] , (error, results) =>{
            
            db.query('INSERT INTO atendente_permissao SET ?', {id_usuario: id_usuario, contato: contato, id_atendente: id_atendente, id_setor: id_setor} , (error, results) =>{
               if (error){
                  console.log(error)
                  res.write("erro");
                  res.end();      
                  return next();
               }
               res.write(JSON.stringify("ok"));
               res.end();      
               return next();
                  
            })

         })
         
      }else{
         
         db.query('INSERT INTO atendente_permissao SET ?', {id_usuario: id_usuario, contato: contato, id_atendente: id_atendente, id_setor: id_setor} , (error, results) =>{
            if (error){
               console.log(error)
               res.write("erro");
               res.end();      
               return next();
            }
            
            res.write("ok");
            res.end();    
            return next();
            
         })
      }
   })
   

}


exports.getsetores = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
         db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         
            
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              
              return next();
            }
         
            req.user = result[0];
            
            db.query('SELECT * FROM setores  WHERE id_usuario = ? ', [decoded.id], async (error,result) => {
               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }

               

               if(!result) {
              
                  return next();
               }
               
               req.setores = result;
               return next();
               
            })
         })
         
   } else {
      res.status(200).redirect("/entrar")
   }

}

exports.getatendentes = async (req, res, next) => {
   if (req.cookies.jwt) {

      const decoded = await promisify(jwt.verify)(
         req.cookies.jwt,
         process.env.JWT_SECRET
       );
        
         
         db.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (error, result) => {
         
            
            if (error){
               console.log(error)
               return next();
            }
            if(!result) {
              
              return next();
            }
         
            req.user = result[0];

            db.query('SELECT * FROM setores  WHERE id_usuario = ? ', [decoded.id], async (error,result) => {
               if (error){
                  console.log(error)
                  res.write("erro")
                  res.end()
               }

               

               if(!result) {
              
                  return next();
               }
               
               req.setores = result;
               db.query('SELECT * FROM atendentes  WHERE user_id = ? ', [decoded.id], async (error,result) => {
                  if (error){
                     console.log(error)
                     res.write("erro")
                     res.end()
                  }
   
                  
   
                  if(!result) {
                 
                     return next();
                  }
                  
                  req.atendentes = result;
                  
                    
                     return next();
                 
                  
                  
               })
               
            })
            
            
         })
         
   } else {
      res.status(200).redirect("/entrar")
   }

}
exports.getatendentesetor = async (req, res, next) => {

   const {id_usuario, id_atendente } = req.body
   
   
   db.query('SELECT atendente_setor.id_atendente, atendentes.nome, atendentes.login, atendentes.senha, atendente_setor.id_setor, setores.setor FROM atendente_setor left JOIN setores ON atendente_setor.id_setor=setores.id INNER JOIN atendentes ON atendente_setor.id_atendente= atendentes.id  WHERE  atendente_setor.id_usuario = ?  AND atendente_setor.id_atendente = ?',  [id_usuario, id_atendente], async (error,result) => {
      if (error){
         console.log(error)
         res.write("erro")
         res.end()
      }

      

      if(!result) {
   
         return next();
      }
      res.write(JSON.stringify(result))
      res.end();
      
      return next();

   })
      
}