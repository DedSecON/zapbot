-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 04-Dez-2020 às 13:46
-- Versão do servidor: 5.7.28-0ubuntu0.19.04.2
-- PHP Version: 7.2.24-0ubuntu0.19.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `whatsbot`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `atendentes`
--

CREATE TABLE `atendentes` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nome` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `id_setor` text,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `atendentes`
--

INSERT INTO `atendentes` (`id`, `created_at`, `updated_at`, `nome`, `login`, `senha`, `id_setor`, `user_id`) VALUES
(34, '2020-11-22 18:59:12', NULL, 'teste', 'teste', '123', NULL, 1),
(37, '2020-11-29 18:28:37', NULL, 'Thamires', 'tata', '123', NULL, 3),
(38, '2020-11-29 18:50:57', NULL, 'atendente1', 'atendente1', '123', NULL, 6),
(39, '2020-11-29 18:51:11', NULL, 'atendente2', 'atendente2', '123', NULL, 6),
(40, '2020-11-29 20:24:33', NULL, 'teste', 'teste1', '123', NULL, 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `atendente_online`
--

CREATE TABLE `atendente_online` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_atendente` int(11) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `setor` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `atendente_nome` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `atendente_online`
--

INSERT INTO `atendente_online` (`id`, `id_usuario`, `id_atendente`, `status`, `setor`, `atendente_nome`) VALUES
(2, 1, 34, 'offline', 'Geral (todos)', 'teste'),
(3, 1, 35, 'offline', 'Telemarkting', 'teste2'),
(4, 1, 36, 'offline', 'Contabilidade', 'teste3'),
(5, 1, 37, 'offline', 'Geral (todos)', 'teste'),
(6, 6, 38, 'offline', 'Geral (todos)', 'atendente1'),
(7, 6, 39, 'offline', 'teste', 'atendente2'),
(8, 1, 38, 'online', 'Geral (todos)', 'atendente1');

-- --------------------------------------------------------

--
-- Estrutura da tabela `atendente_permissao`
--

CREATE TABLE `atendente_permissao` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_atendente` int(11) DEFAULT NULL,
  `contato` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_setor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `atendente_permissao`
--

INSERT INTO `atendente_permissao` (`id`, `id_usuario`, `id_atendente`, `contato`, `id_setor`) VALUES
(56, 1, 34, '556992095312@c.us', 0),
(65, 1, 34, '556593178898@c.us', 0),
(66, 1, 34, '556992227797@c.us', 0),
(67, 1, 34, '556992710679@c.us', 0),
(70, 1, 34, '553899279890@c.us', 0),
(73, 1, 34, '556992030924@c.us', 0),
(75, 6, 38, '5516988769291@c.us', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `atendente_setor`
--

CREATE TABLE `atendente_setor` (
  `id_atendente` int(11) NOT NULL,
  `id_setor` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `atendente_setor`
--

INSERT INTO `atendente_setor` (`id_atendente`, `id_setor`, `id`, `id_usuario`) VALUES
(34, 0, 30, 1),
(34, 3, 31, 1),
(35, 9, 32, 1),
(36, 4, 33, 1),
(37, 13, 34, 3),
(38, 0, 35, 6),
(39, 0, 36, 6),
(39, 14, 37, 6),
(40, 0, 38, 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `bot`
--

CREATE TABLE `bot` (
  `id` int(11) NOT NULL,
  `gatilho` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensagem` text COLLATE utf8mb4_unicode_ci,
  `stage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_usuario` int(11) NOT NULL,
  `anexo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'texto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `bot`
--

INSERT INTO `bot` (`id`, `gatilho`, `mensagem`, `stage`, `created_at`, `id_usuario`, `anexo`, `tipo`) VALUES
(62, 'inicio_atendimento', 'teste', '1', '2020-12-02 16:01:11', 3, NULL, 'texto'),
(63, 'menu_principal', 'teste', '2', '2020-12-02 16:01:11', 3, NULL, 'texto'),
(64, 'menu_invalido', '', '3', '2020-12-02 16:01:11', 3, NULL, 'texto'),
(65, 'fim_atendimento', '', '5', '2020-12-02 16:01:11', 3, NULL, 'texto'),
(66, '1', '🛒 Valor do Banco de Petições é de R$ 137,00\r\n\r\nClique no link e adquira o seu ⬇\r\n\r\nhttps://app.monetizze.com.br/checkout/PLS72449\r\n\r\nFormas de pagamento : Cartão de crédito em até (12X) ou Boleto Bancário (À vista)\r\n\r\nPagamento único acesso vitalício e atualizações futuras gratuitas\r\n\r\nObs: Cartão de crédito liberação imediato , Boleto bancário até 48 hrs', '4', '2020-12-02 16:01:18', 3, '', 'texto'),
(67, 'inicio_atendimento', 'bot de atendimento', '1', '2020-12-03 22:55:36', 1, NULL, 'texto'),
(68, 'menu_principal', '', '2', '2020-12-03 22:55:36', 1, NULL, 'texto'),
(69, 'menu_invalido', '', '3', '2020-12-03 22:55:36', 1, NULL, 'texto'),
(70, 'fim_atendimento', 'fim do atendimento', '5', '2020-12-03 22:55:36', 1, NULL, 'texto');

-- --------------------------------------------------------

--
-- Estrutura da tabela `campanhas`
--

CREATE TABLE `campanhas` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `campanha` varchar(255) NOT NULL,
  `anexo` varchar(255) DEFAULT NULL,
  `mensagem` text NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `campanhas`
--

INSERT INTO `campanhas` (`id`, `created_at`, `updated_at`, `campanha`, `anexo`, `mensagem`, `tipo`, `id_usuario`) VALUES
(14, '2020-10-26 19:41:55', NULL, 'teste', '1603741315269teste2.mp4', 'asdfasdfdf', 'video', 1),
(15, '2020-11-27 19:28:33', NULL, 'arquivo do excel', '1606505313249Whatsbot.xlsx', 'asdfasfasdfasdfasdf', 'documento', 1),
(16, '2020-11-29 18:47:15', NULL, 'teste', '160667563550912.jpg', 'oi iiii', 'imagem', 6),
(17, '2020-12-02 17:39:56', NULL, 'Teste de midia', '16069307960013.jpg', 'dsadasdadsasd', 'imagem', 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `campanhas_enviadas`
--

CREATE TABLE `campanhas_enviadas` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `enviado` int(11) DEFAULT NULL,
  `erro` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `campanhas_enviadas`
--

INSERT INTO `campanhas_enviadas` (`id`, `created_at`, `updated_at`, `enviado`, `erro`, `id_usuario`) VALUES
(2, '2020-09-12 23:52:44', NULL, 1, 0, 1),
(3, '2020-09-12 23:53:04', NULL, 1, 0, 1),
(4, '2020-09-12 23:53:24', NULL, 0, 1, 1),
(5, '2020-10-09 00:49:06', NULL, 1, 0, 1),
(6, '2020-10-09 00:50:56', NULL, 1, 0, 1),
(7, '2020-10-10 17:27:16', NULL, NULL, NULL, NULL),
(8, '2020-10-19 23:02:31', NULL, 1, 0, 1),
(9, '2020-10-19 23:04:57', NULL, 1, 0, 1),
(10, '2020-10-19 23:09:26', NULL, 1, 0, 1),
(11, '2020-10-19 23:11:30', NULL, 1, 0, 1),
(12, '2020-10-19 23:19:34', NULL, 1, 0, 1),
(13, '2020-10-19 23:21:15', NULL, 1, 0, 1),
(14, '2020-10-19 23:23:17', NULL, 1, 0, 1),
(15, '2020-10-19 23:32:40', NULL, 1, 0, 1),
(16, '2020-10-19 23:33:34', NULL, 1, 0, 1),
(17, '2020-10-19 23:38:16', NULL, 1, 0, 1),
(18, '2020-10-19 23:39:35', NULL, 1, 0, 1),
(19, '2020-10-19 23:39:46', NULL, 1, 0, 1),
(20, '2020-10-23 16:55:05', NULL, 1, 0, 1),
(21, '2020-10-23 22:10:31', NULL, 1, 0, 1),
(22, '2020-10-23 22:10:51', NULL, 0, 1, 1),
(23, '2020-10-23 22:33:05', NULL, 1, 0, 1),
(24, '2020-10-24 15:27:46', NULL, 1, 0, 1),
(25, '2020-10-24 15:28:05', NULL, 0, 1, 1),
(26, '2020-10-24 16:05:22', NULL, 1, 0, 1),
(27, '2020-10-24 16:05:43', NULL, 0, 1, 1),
(28, '2020-10-26 16:48:48', NULL, 1, 0, 1),
(29, '2020-10-26 16:49:08', NULL, 0, 1, 1),
(30, '2020-10-26 16:52:11', NULL, 1, 0, 1),
(31, '2020-10-26 16:58:29', NULL, 1, 0, 1),
(32, '2020-10-26 17:14:51', NULL, 1, 0, 1),
(33, '2020-10-26 17:15:12', NULL, 0, 1, 1),
(34, '2020-10-26 17:46:14', NULL, 1, 0, 1),
(35, '2020-10-26 18:32:43', NULL, 1, 0, 1),
(36, '2020-10-26 18:35:05', NULL, 1, 0, 1),
(37, '2020-10-26 19:00:04', NULL, 1, 0, 1),
(38, '2020-10-26 19:00:59', NULL, 1, 0, 1),
(39, '2020-10-26 19:03:22', NULL, 1, 0, 1),
(40, '2020-10-26 19:04:16', NULL, 1, 0, 1),
(41, '2020-10-26 19:04:56', NULL, 1, 0, 1),
(42, '2020-10-26 19:05:41', NULL, 1, 0, 1),
(43, '2020-10-26 19:06:01', NULL, 0, 1, 1),
(44, '2020-10-26 19:08:45', NULL, 1, 0, 1),
(45, '2020-10-26 19:09:33', NULL, 1, 0, 1),
(46, '2020-10-26 19:10:43', NULL, 1, 0, 1),
(47, '2020-10-26 19:41:38', NULL, 1, 0, 1),
(48, '2020-10-26 19:42:00', NULL, 1, 0, 1),
(49, '2020-10-26 19:42:21', NULL, 0, 1, 1),
(50, '2020-10-26 20:15:04', NULL, 1, 0, 1),
(51, '2020-10-26 20:15:23', NULL, 0, 1, 1),
(52, '2020-10-26 20:20:11', NULL, 1, 0, 1),
(53, '2020-10-26 20:20:30', NULL, 0, 1, 1),
(54, '2020-10-27 23:51:39', NULL, 1, 0, 1),
(55, '2020-11-13 13:01:12', NULL, 1, 0, 1),
(56, '2020-11-13 13:02:26', NULL, 1, 0, 1),
(57, '2020-11-13 13:04:11', NULL, 1, 0, 1),
(58, '2020-11-13 13:08:12', NULL, 1, 0, 1),
(59, '2020-11-13 13:10:21', NULL, 1, 0, 1),
(60, '2020-11-13 13:11:13', NULL, 1, 0, 1),
(61, '2020-11-13 13:14:51', NULL, 1, 0, 1),
(62, '2020-11-13 13:15:29', NULL, 1, 0, 1),
(63, '2020-11-13 13:16:25', NULL, 1, 0, 1),
(64, '2020-11-13 13:17:09', NULL, 1, 0, 1),
(65, '2020-11-13 13:21:18', NULL, 1, 0, 1),
(66, '2020-11-13 13:22:28', NULL, 1, 0, 1),
(67, '2020-11-13 13:22:54', NULL, 0, 1, 1),
(68, '2020-11-17 13:45:42', NULL, 0, 1, 1),
(69, '2020-11-17 13:46:28', NULL, 0, 1, 1),
(70, '2020-11-17 14:16:22', NULL, 0, 1, 1),
(71, '2020-11-17 14:25:00', NULL, 1, 0, 1),
(72, '2020-11-17 14:25:22', NULL, 1, 0, 1),
(73, '2020-11-27 19:31:19', NULL, 1, 0, 1),
(74, '2020-11-29 18:48:33', NULL, 1, 0, 6),
(75, '2020-11-29 18:50:09', NULL, 1, 0, 6);

-- --------------------------------------------------------

--
-- Estrutura da tabela `contatos`
--

CREATE TABLE `contatos` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nome` varchar(255) DEFAULT NULL,
  `celular` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_grupo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `contatos`
--

INSERT INTO `contatos` (`id`, `created_at`, `updated_at`, `nome`, `celular`, `email`, `id_usuario`, `id_grupo`) VALUES
(378, '2020-11-27 19:31:04', NULL, 'teste', '553899279890', 'teste@teste.com', 1, 4),
(379, '2020-11-29 18:45:31', '2020-11-29 18:49:57', 'teste', '5516988769291', '', 6, 5),
(455, '2020-11-29 18:46:44', NULL, '1 Of De AÃ§ucena AmÃ¡lia', '553391435896', '', 6, 6),
(456, '2020-11-29 18:46:44', NULL, 'asdfaasdfasdf', '553391435896', '', 6, 6),
(457, '2020-11-29 18:46:44', NULL, '1 Of Mateus Leme Saulo', '553191026961', '', 6, 6),
(458, '2020-11-29 18:46:44', NULL, '11931Ba', '557199033814', '', 6, 6),
(459, '2020-11-29 18:46:44', NULL, '12529C', '551991909994', '', 6, 6),
(460, '2020-11-29 18:46:44', NULL, '2 Of Mesquita JoÃ£o Luiz', '553391720891', '', 6, 6),
(461, '2020-11-29 18:46:44', NULL, '2 Of Notas Malacacheta Renata', '553391116213', '', 6, 6),
(462, '2020-11-29 18:46:44', NULL, '2 Of Notas Vespasiano', '553188677463', '', 6, 6),
(463, '2020-11-29 18:46:44', NULL, '2 Of Santos Dumont Juliana', '553299446620', '', 6, 6),
(464, '2020-11-29 18:46:44', NULL, 'Nome', '553191626090', '', 6, 6),
(465, '2020-11-29 18:46:44', NULL, 'A Chirin Meu', '553188935813', '', 6, 6),
(466, '2020-11-29 18:46:44', NULL, 'Abadas Edson', '553188145883', '', 6, 6),
(467, '2020-11-29 18:46:44', NULL, 'Abdala Serralheria Jornal', '553196821644', '', 6, 6),
(468, '2020-11-29 18:46:44', NULL, 'Abner CÃ¢mara', '553193380837', '', 6, 6),
(469, '2020-11-29 18:46:44', NULL, 'Abner Mediphacos', '553183483200', '', 6, 6),
(470, '2020-11-29 18:46:44', NULL, 'Academi Pratique Bruno - Summer', '553175053750', '', 6, 6),
(471, '2020-11-29 18:46:44', NULL, 'Academia Aquatica', '553175002997', '', 6, 6),
(472, '2020-11-29 18:46:44', NULL, 'Acai', '553198988982', '', 6, 6),
(473, '2020-11-29 18:46:44', NULL, 'Acessa Car', '553186814054', '', 6, 6),
(474, '2020-11-29 18:46:44', NULL, 'Acioli Mediphacos Zap', '556284129476', '', 6, 6),
(475, '2020-11-29 18:46:44', NULL, 'Acougue Ivani Wellington', '553194684270', '', 6, 6),
(476, '2020-11-29 18:46:44', NULL, 'Adair Antenas', '553191054219', '', 6, 6),
(477, '2020-11-29 18:46:44', NULL, 'Adelia Web Design', '553184757274', '', 6, 6),
(478, '2020-11-29 18:46:44', NULL, 'Ademir Carreteiro', '553191671224', '', 6, 6),
(479, '2020-11-29 18:46:44', NULL, 'Ademir Carreto', '553196474773', '', 6, 6),
(480, '2020-11-29 18:46:44', NULL, 'Ademir Loubak Carreteiro', '553191671224', '', 6, 6),
(481, '2020-11-29 18:46:44', NULL, 'Adestramento Luiz Guia', '553196014561', '', 6, 6),
(482, '2020-11-29 18:46:44', NULL, 'Adilson Alta Energia', '553193108169', '', 6, 6),
(483, '2020-11-29 18:46:44', NULL, 'Adilson Foco Impressao', '553186341817', '', 6, 6),
(484, '2020-11-29 18:46:44', NULL, 'Adilson Marvado', '553187875238', '', 6, 6),
(485, '2020-11-29 18:46:44', NULL, 'Adilson Representante', '553198036242', '', 6, 6),
(486, '2020-11-29 18:46:44', NULL, 'Adilson representante 01', '553189060166', '', 6, 6),
(487, '2020-11-29 18:46:44', NULL, 'Adilson Tadeu - Summer Cloro', '553799991982', '', 6, 6),
(488, '2020-11-29 18:46:44', NULL, 'Administradores', '558396199225', '', 6, 6),
(489, '2020-11-29 18:46:44', NULL, 'Adolfo Pedras Sao Tomaz', '553588102528', '', 6, 6),
(490, '2020-11-29 18:46:44', NULL, 'Adriana Bolando Bolos', '553185448740', '', 6, 6),
(491, '2020-11-29 18:46:44', NULL, 'Adriana Cop Pampulha', '553196817082', '', 6, 6),
(492, '2020-11-29 18:46:44', NULL, 'Adriana Diniz Cliente Mediphacos', '552192961218', '', 6, 6),
(493, '2020-11-29 18:46:44', NULL, 'Adriana Oportunidade Imoveis', '553184245407', '', 6, 6),
(494, '2020-11-29 18:46:44', NULL, 'Adriana Times Led', '553199514536', '', 6, 6),
(495, '2020-11-29 18:46:44', NULL, 'Adriane Brito - Summer Cloro', '553180265035', '', 6, 6),
(496, '2020-11-29 18:46:44', NULL, 'Adriane Prado', '553182376358', '', 6, 6),
(497, '2020-11-29 18:46:44', NULL, 'Adriano Jana Site', '553188122199', '', 6, 6),
(498, '2020-11-29 18:46:44', NULL, 'Adriano Mano Paraiso', '553188478257', '', 6, 6),
(499, '2020-11-29 18:46:44', NULL, 'Adriano Mway Thay', '553193828557', '', 6, 6),
(500, '2020-11-29 18:46:44', NULL, 'Adson Armario', '553186355396', '', 6, 6),
(501, '2020-11-29 18:46:44', NULL, 'Advogado Financeiras', '553189025642', '', 6, 6),
(502, '2020-11-29 18:46:44', NULL, 'Advogado Financeiras 01', '553171642529', '', 6, 6),
(503, '2020-11-29 18:46:44', NULL, 'AE jeferson', '553299200182', '', 6, 6),
(504, '2020-11-29 18:46:44', NULL, 'Afranio Site', '553171141001', '', 6, 6),
(505, '2020-11-29 18:46:44', NULL, 'Agatha Paraiso', '553198665514', '', 6, 6),
(506, '2020-11-29 18:46:44', NULL, 'Agencia Maciel', '553198525646', '', 6, 6),
(507, '2020-11-29 18:46:44', NULL, 'Agrovip Pet Shop', '553182946432', '', 6, 6),
(508, '2020-11-29 18:46:44', NULL, 'Aladim Repr Espirito Santo', '552799993385', '', 6, 6),
(509, '2020-11-29 18:46:44', NULL, 'Alan ENTAO Ta', '553193395132', '', 6, 6),
(510, '2020-11-29 18:46:44', NULL, 'Alan Imoveis', '553185849953', '', 6, 6),
(511, '2020-11-29 18:46:44', NULL, 'Alan Moura - Summer Cloro', '553189209148', '', 6, 6),
(512, '2020-11-29 18:46:44', NULL, 'Alan Pereira - Summer Cloro', '553788151950', '', 6, 6),
(513, '2020-11-29 18:46:44', NULL, 'Alan Rodrigo Alian', '553188673038', '', 6, 6),
(514, '2020-11-29 18:46:44', NULL, 'Alan Site MÃºsica', '553184989114', '', 6, 6),
(515, '2020-11-29 18:46:44', NULL, 'Alan Sulzer', '553184687460', '', 6, 6),
(516, '2020-11-29 18:46:44', NULL, 'Alberto Santos - Summer Cloro', '553193998475', '', 6, 6),
(517, '2020-11-29 18:46:44', NULL, 'Alecio Feira Pic Pisci', '551153983902', '', 6, 6),
(518, '2020-11-29 18:46:44', NULL, 'Alencar', '553199921444', '', 6, 6),
(519, '2020-11-29 18:46:44', NULL, 'Alerrandro PARAISO CLIENTE', '553185059468', '', 6, 6),
(520, '2020-11-29 18:46:44', NULL, 'Alessandra Dentista', '553187561182', '', 6, 6),
(521, '2020-11-29 18:46:45', NULL, 'Alessandra Paraiso', '553199733424', '', 6, 6),
(522, '2020-11-29 18:46:45', NULL, 'Alessandra Viv', '553199733424', '', 6, 6),
(523, '2020-11-29 18:46:45', NULL, 'Alessandro BrandÃ£o - Summer Cloro', '553192323200', '', 6, 6),
(524, '2020-11-29 18:46:45', NULL, 'Alex Ferreira - Summer Cloro', '553197124861', '', 6, 6),
(525, '2020-11-29 18:46:45', NULL, 'Alex Piscinas Feira Floriano', '554891767530', '', 6, 6),
(526, '2020-11-29 18:46:45', NULL, 'Alex Subsindico Asia', '553192730278', '', 6, 6),
(527, '2020-11-29 18:46:45', NULL, 'Alex Ubber', '553191422790', '', 6, 6),
(528, '2020-11-29 18:46:45', NULL, 'Alexandra Cliente Paraiso', '553171615551', '', 6, 6),
(529, '2020-11-29 18:46:45', NULL, 'Alexandra Z Gestao', '553196351246', '', 6, 6);

-- --------------------------------------------------------

--
-- Estrutura da tabela `grupos`
--

CREATE TABLE `grupos` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nome_grupo` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `grupos`
--

INSERT INTO `grupos` (`id`, `created_at`, `updated_at`, `nome_grupo`, `descricao`, `id_usuario`) VALUES
(3, '2020-09-12 23:41:20', NULL, 'grupo 1', 'adsfasdfaad a asdf asdf', 1),
(4, '2020-11-13 13:00:25', NULL, 'grupo3', 'asdfasdf', 1),
(5, '2020-11-29 18:44:52', NULL, 'grupo 1', 'grupo de contabilidade', 6),
(6, '2020-11-29 18:45:41', NULL, 'grupo 2', 'asdfasfasdf', 6);

-- --------------------------------------------------------

--
-- Estrutura da tabela `setores`
--

CREATE TABLE `setores` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `setor` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `setores`
--

INSERT INTO `setores` (`id`, `created_at`, `updated_at`, `setor`, `id_usuario`) VALUES
(3, '2020-11-06 05:32:02', '2020-11-18 12:43:12', 'Administrativo', 1),
(4, '2020-11-09 14:26:11', '2020-11-18 12:43:57', 'Contabilidade', 1),
(5, '2020-11-16 19:57:06', '2020-11-18 12:44:01', 'RH', 1),
(6, '2020-11-06 05:32:02', '2020-11-18 12:44:09', 'TI', 1),
(7, '2020-11-06 05:32:02', '2020-11-18 12:45:43', 'Pos vendas', 1),
(8, '2020-11-09 14:26:11', '2020-11-18 12:45:56', 'Vendas', 1),
(9, '2020-11-16 19:57:06', '2020-11-18 12:47:30', 'Telemarkting', 1),
(10, '2020-11-06 05:32:02', '2020-11-18 12:47:38', 'Compras', 1),
(13, '2020-11-29 18:28:13', NULL, 'Atendente1', 3),
(14, '2020-11-29 18:50:38', NULL, 'teste', 6),
(15, '2020-11-29 20:24:05', NULL, 'teste', 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nome` varchar(255) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `maskeid` varchar(255) NOT NULL,
  `admin` int(11) DEFAULT '0',
  `admin2` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `created_at`, `updated_at`, `nome`, `senha`, `email`, `maskeid`, `admin`, `admin2`) VALUES
(1, '2020-09-06 14:56:19', '2020-11-01 02:10:25', 'Admin', '$2a$08$vvEwo7kUJNsz1MMVrHPID.Eji2x0iDafHpKUyCXUKIrn5VCxhBT9C', 'admin@admin.com', '1Juwb2', 1, 0),
(2, '2020-09-12 22:04:24', '2020-11-29 18:15:04', 'test teste', '$2a$08$JugQsng8.AjQ/YEv.POrceBQBC5L5i2ckl4RdQjqrKBZ4zxhOB.eW', 'teste@admin.com', 'dYoSGn', 0, 0),
(3, '2020-10-22 20:11:46', '2020-12-02 17:34:45', 'teste23', '$2a$08$x0EI1Ggcn0R9G6VcrVWgVefHKYZhk8HTZjulmMpQKPpJuCBnX18Xy', 'teste@teste.com', 'lrzAPp', 1, 0),
(4, '2020-11-27 19:27:00', '2020-11-29 18:15:10', 'teste123', '$2a$08$4aTAv.i4MHKb6V6FdsNSz.QMtoM8qnjvvWz77zYnaTo3vaLHgmce6', 'teste123@teste.com', 'UVcX1j', 0, 0),
(5, '2020-11-29 18:36:26', NULL, 'afonso', '$2a$08$qs0nxcg7F0kpbxYIMFF2S.Xfxh74sPwuYABU7cK.l0hN2D2/QmYqK', 'testando@teste.com', 'ds21Mh', 0, 0),
(6, '2020-11-29 18:44:15', '2020-11-29 19:13:41', 'teste', '$2a$08$.d6zhqyUtTo/pyqAnTBa6.RzbQQdNguY57VN0yNxT2AZdugP5Xau6', 'teste222@teste.com', 'AbgBty', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `atendentes`
--
ALTER TABLE `atendentes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `atendente_online`
--
ALTER TABLE `atendente_online`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `atendente_permissao`
--
ALTER TABLE `atendente_permissao`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `atendente_setor`
--
ALTER TABLE `atendente_setor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bot`
--
ALTER TABLE `bot`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `campanhas`
--
ALTER TABLE `campanhas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `campanhas_enviadas`
--
ALTER TABLE `campanhas_enviadas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contatos`
--
ALTER TABLE `contatos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `setores`
--
ALTER TABLE `setores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `atendentes`
--
ALTER TABLE `atendentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `atendente_online`
--
ALTER TABLE `atendente_online`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `atendente_permissao`
--
ALTER TABLE `atendente_permissao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;
--
-- AUTO_INCREMENT for table `atendente_setor`
--
ALTER TABLE `atendente_setor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT for table `bot`
--
ALTER TABLE `bot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;
--
-- AUTO_INCREMENT for table `campanhas`
--
ALTER TABLE `campanhas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `campanhas_enviadas`
--
ALTER TABLE `campanhas_enviadas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;
--
-- AUTO_INCREMENT for table `contatos`
--
ALTER TABLE `contatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=530;
--
-- AUTO_INCREMENT for table `grupos`
--
ALTER TABLE `grupos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `setores`
--
ALTER TABLE `setores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
