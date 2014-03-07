-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Ven 07 Mars 2014 à 13:29
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `projet`
--
CREATE DATABASE IF NOT EXISTS `projet` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `projet`;

-- --------------------------------------------------------

--
-- Structure de la table `enregistrements`
--

CREATE TABLE IF NOT EXISTS `enregistrements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` text NOT NULL,
  `nom` text NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `objets`
--

CREATE TABLE IF NOT EXISTS `objets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` text NOT NULL,
  `categorie` text NOT NULL,
  `description` text NOT NULL,
  `image` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `objets`
--

INSERT INTO `objets` (`id`, `nom`, `categorie`, `description`, `image`) VALUES
(1, 'Lit', 'Chambre', 'Ensemble literie contant :\r\n- Le lit \r\n- Le sommier\r\n- Un matelas \r\n\r\nLiterie entièrement en chêne.\r\nMatelas en mousse, confort 100%.\r\n\r\nDimension 160x200', 'ImagesElements/Lit.jpg'),
(2, 'Chaise', 'Cuisine', 'Chaise de cuisine. \r\n\r\nRésistante et solide, fabrication artisanale. \r\nMatière principale : acajou \r\nDimension : 100x46x55', 'ImagesElements/Chaise.jpg'),
(3, 'Lavabo', 'Salle de bain', 'Lavabo de salle de bain. \r\n\r\nMatière : céramique\r\nHauteur : 120 cm', 'ImagesElements/LavaboS.jpg'),
(4, 'Table', 'Cuisine', 'Table de cuisine. \r\n\r\nEntièrement en bois (cerisier) pouvant accueillir jusqu''à huit personnes.\r\nVernis et très robuste.', 'ImagesElements/Table.jpg'),
(5, 'Lavabo', 'Cuisine', 'Lavabo de salle de cuisine. \r\n\r\nMatière : céramique\r\nHauteur : 120 cm', 'ImagesElements/LavaboC.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` text NOT NULL,
  `motDePasse` text NOT NULL,
  `nom` text NOT NULL,
  `prenom` text NOT NULL,
  `fonction` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

--
-- Contenu de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `pseudo`, `motDePasse`, `nom`, `prenom`, `fonction`) VALUES
(24, 'Guiguicop', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Copin', 'Guillaume', 'architecte');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
