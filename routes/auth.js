const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router();

// Sistema
router.post('/cadastro', authController.register)

router.post('/entrar', authController.login)


router.post('/addusuario', authController.addusuario)
router.post('/editusuario', authController.editusuario)
router.post('/deletarusuario', authController.deletarusuario)
router.post('/mudarusuario', authController.mudarusuario)

router.get('/logout', authController.logout)

router.post('/addcampanha', authController.addcampanha)
router.post('/deletarcampanha', authController.deletarcampanha)

router.post('/addcontato', authController.addcontato)
router.post('/editcontato', authController.editcontato)
router.post('/deletarcontato', authController.deletarcontato)

router.post('/addgrupo', authController.addgrupo)
router.post('/editgrupo', authController.editgrupo)
router.post('/deletargrupo', authController.deletargrupo)


router.post('/addsetor', authController.addsetor)
router.post('/editsetor', authController.editsetor)
router.post('/deletarsetor', authController.deletarsetor)

router.post('/addatendente', authController.addatendente)
router.post('/addatendentesetor', authController.addatendentesetor)
router.post('/getatendentesetor', authController.getatendentesetor)
// router.post('/editatendente', authController.editsetor)
 router.post('/deletaratendente', authController.deletaratendente)


router.get('/getqr', authController.getqr)
router.post('/enviarwhats', authController.enviarwhats)


router.post('/enviadas', authController.enviadas)
router.post('/getmeses', authController.getmeses)

router.post('/iniciarbot', authController.iniciarbot)
router.post('/addbot', authController.addbot)

router.post('/deletarwhats', authController.deletarwhats)

router.post('/addresposta', authController.addresposta)
router.post('/excluirresposta', authController.excluirresposta)



router.get('/listarchats', authController.chat)
router.post('/chatscontato', authController.chat2)
router.post('/downloadfile', authController.downloadfile)
router.post('/getfotocontato', authController.getfotocontato)
router.post('/loginatendente', authController.atendentelogin)
router.get('/logoutatendente', authController.atendentelogout)
router.post('/sendseen', authController.sendseen)
router.post('/enviartexto', authController.enviartexto)
router.post('/atendentesonline', authController.getonline)
router.post('/aceitarchat', authController.aceitarchat)
router.post('/permissoes', authController.permissoes)
router.post('/sendarquivos', authController.sendarquivos)




module.exports = router;