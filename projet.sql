-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mer 12 Mars 2014 à 10:23
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
(1, 'Lit', 'Chambre', 'Ensemble literie contenant :<br> - Le lit <br> - Le sommier <br>- Un matelas <br> <br> Literie enti&egrave;rement en ch&ecirc;ne. <br>Matelas en mousse, confort 100%. <br> <br>Dimension 160x200', 'ImagesElements/Lit.jpg'),
(2, 'Chaise', 'Cuisine', 'Chaise de cuisine.<br><br> R&eacute;sistante et solide, fabrication artisanale.<br>Mati&egrave;re principale : acajou <br>Dimension : 100x46x55', 'ImagesElements/Chaise.jpg'),
(3, 'Lavabo', 'Salle de bain', 'Lavabo de salle de bain.<br><br>Mati&egrave;re : c&eacute;ramique<br>Hauteur : 120 cm', 'ImagesElements/LavaboS.jpg'),
(4, 'Table', 'Cuisine', 'Table de cuisine.<br><br>Enti&egrave;rement en bois (cerisier) pouvant accueillir jusqu''&agrave; huit personnes.<br>Vernis et tr&egrave;s robuste.', 'ImagesElements/Table.jpg'),
(5, 'Lavabo', 'Cuisine', 'Lavabo de cuisine.<br><br>Mati&egrave;re : c&eacute;ramique<br>Hauteur : 120 cm\n', 'ImagesElements/LavaboC.jpg');

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
