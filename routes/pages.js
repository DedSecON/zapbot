const express = require('express')
const authController = require('../controllers/auth');

const router = express.Router();
const fs = require('fs');

router.get('/', authController.isLoggedIn, (req, res) => {
   console.log(req.contatos)
   res.render('index', {
      user: req.user,
      contatos: req.contatos, 
      grupos: req.grupos, 
      enviadas: req.enviadas, 
      pendentes: req.pendentes, 
    
      active: "home",
      whichPartial: function() {
         return "home";
      }
    });
 });

router.get('/teste', authController.isLoggedIn, (req, res) => {
   res.render('index', {
      user: req.user, 
      whichPartial: function() {
         return "teste";
      }
    });
 });

router.get('/qrcode/:id', authController.getUserById, (req, res) => {
   res.render('qrcode', {
      user: req.user, 
      
    });
 });


router.get('/entrar', (req, res) => {
   console.log(req.cookies.jwt)
   if(req.cookies.jwt){
      console.log(req.cookies.jwt)
      if (req.cookies.jwt !== 'loggedout'){
         res.status(200).redirect("/");
      }else{
         res.render('entrar')        
      }
   }else{
      res.render('entrar')     
   }
  
})

router.get('/cadastro', (req, res) => {
   console.log(req.cookies.jwt)
   if(req.cookies.jwt){
      console.log(req.cookies.jwt)
      if (req.cookies.jwt !== 'loggedout'){
         res.status(200).redirect("/");
      }else{
         res.render('cadastro')        
      }
   }else{
      res.render('cadastro')     
   }
  
})

router.get('/grupos', authController.getgrupos, (req, res) => {
   res.render('index', {
      user: req.user, 
      grupos: req.grupos,
      active: "grupos",
      sub: "grupos",
      whichPartial: function() {
         return "grupos";
      }
    });
 });

router.get('/contatos', authController.getcontatos, (req, res) => {
   
   res.render('index', {
      user: req.user, 
      contatos: req.contatos, 
      grupos: req.grupos,
      active: "grupos",
      sub: "contatos",
      whichPartial: function() {
         return "contatos";
      }
    });
 });

router.get('/admins', authController.getadmin, (req, res) => {
   
   res.render('index', {
      user: req.user, 
      admins: req.admins, 
      
      active: "admins",
      
      whichPartial: function() {
         return "admins";
      }
    });
 });

router.get('/campanhas', authController.getcampanhas, (req, res) => {
   
   res.render('index', {
      user: req.user, 
      campanhas: req.campanhas,
      grupos: req.grupos,
      id_grupo: req.id_grupo,
      active: "campanhas",
      sub: "criar",
      whichPartial: function() {
         return "campanha";
      }
    });
 });


router.get('/setores', authController.getsetores, (req, res) => {
   
   res.render('index', {
      user: req.user, 
      setores: req.setores,
      active: "atendimento",
      sub: "setores",
      whichPartial: function() {
         return "setores";
      }
    });
 });



router.get('/atendentes', authController.getatendentes, (req, res) => {
   
   res.render('index', {
      user: req.user, 
      setores: req.setores,
      atendentes: req.atendentes,
   
      active: "atendimento",
      sub: "atendentes",
      whichPartial: function() {
         return "atendentes";
      }
    });
 });
 router.get('/whats', authController.isLoggedIn, (req, res) => {
   res.render('index', {
      user: req.user, 
      active: "whats",
      sub: "configurar",
      whichPartial: function() {
         return "whats";
      }
    });
 });


 router.get('/bot', authController.bot, async (req, res) => {
   console.log(req.bot)
   res.render('index', {
      user: req.user, 
      active: "whats",
      status: req.status,
      bot: req.bot,
      data: req.data, 
      sub: "bot",
      whichPartial: function() {
         return "bot";
      }
    });
 });

 router.get('/enviar', authController.checaenviar, (req, res) => {
    console.log("teste", req.campanhas)
   res.render('index', {
      user: req.user, 
      data: req.data, 
      gruposinner: req.gruposinner, 
      grupos: req.grupos, 
      campanhas: req.campanhas, 
      encodedJson : encodeURIComponent(JSON.stringify(req.gruposinner)),
      active: "campanhas",
      sub: "enviar",
      whichPartial: function() {
         return "enviar";
      }
    });
 });


router.get('/getqr', authController.getqr, async (req, res) => {
   console.log("getqr");
   console.log(req.user.id)
   const teste = await req.data;
   if (typeof teste !== "undefined"){
      res.write(JSON.stringify(teste));
      res.end()
   }
   

});


router.get('/enviarmsg', authController.enviarmsg, async (req, res) => {})

router.get('/mensagem', authController.mensagem, async (req, res) => {})

router.get('/login_atendente',  async (req, res) => {
   const chat_id = req.params.chatid;
   console.log(chat_id)
   res.render('chat', {
      chat_id: chat_id,
   });
})


router.get('/chat/:chatid', authController.isAtendenteLogin, async (req, res) => {
   const chat_id = req.params.chatid;
  
   if (req.atendente_user){
      
      var atendente_user = await req.atendente_user;
      var atendente_setor = await req.atendente_setor;
      var nome_setor = await req.nome_setor;
      console.log(nome_setor)
      console.log("req1",atendente_user)
      console.log("req2",atendente_setor)
      res.render('chat', {
         user: req.user,    
         chat_id: chat_id,
         atendente_user: atendente_user,
         atendente_setor: atendente_setor,
         nome_setor: nome_setor,
         
      });
   }else{
      var teste = await req.data;
      if (typeof teste !== "undefined"){
         teste = JSON.stringify(teste)
         teste = JSON.parse(teste)
         res.render('login_atendente', {
            data: teste[0],
            setores: req.setores
         })
         
      }else{
         
         res.render('login_atendente', {
            erro: "Whatsapp não autenticado!"
         })
      }
   }
 });

 module.exports = router;