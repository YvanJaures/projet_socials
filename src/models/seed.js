/**
 * ============================================
 * SEED - Script d'initialisation de la base de données
 * ============================================
 * 
 * Ce fichier remplit la base de données avec des données initiales
 * pour le développement et les tests. Il crée:
 * - Un utilisateur de test (johndoe)
 * - 15 icônes pour les réseaux sociaux
 * - 5 liens sociaux pour l'utilisateur
 * - Une image de profil
 * 
 * @description Script de seeding pour la base de données
 * @requires bcrypt (hachage des mots de passe)
 * @requires prisma (ORM)
 * @requires fs (lecture des fichiers)
 * @requires path (manipulation des chemins)
 */

import bcrypt from 'bcrypt'
import {prisma} from '../prisma.js'
import fs from 'fs'
import path from 'path';

/**
 * Fonction principale de seeding
 * Crée les données initiales dans la base de données
 */
async function seed() {
  try {
    // Nettoyage des tables existantes (ordre important pour les clés étrangères)
    await prisma.link.deleteMany();
    await prisma.icon.deleteMany();
    await prisma.image.deleteMany();
    await prisma.user.deleteMany();
    console.log('🌱 Début du seeding...');

    // Hachage du mot de passe avec bcrypt (10 rounds de sel)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('12345678', saltRounds);

    // ============================================
    // 1. CRÉATION DE L'UTILISATEUR DE TEST
    // ============================================
    const user = await prisma.user.create({
      data: {
        user_name: 'johndoe',
        name: 'Doe',
        prenom: 'John',
        created: new Date(),
        prof_img: '/assets/avatar_prof_1.png',
        email: 'john.doe@example.com',
        password: hashedPassword,
      }
    });
    console.log(`✅ Utilisateur créé: ${user.user_name}`);
    
    // Upload de l'image de profil
    await uploadImages(user.id_user);

    // ============================================
    // 2. CRÉATION DES ICÔNES
    // ============================================
    const icons = [
      { title: 'Instagram', icon: 'instagram' },
      { title: 'X', icon: 'x-twitter' },
      { title: 'Facebook', icon: 'facebook' },
      { title: 'LinkedIn', icon: 'linkedin' },
      { title: 'YouTube', icon: 'youtube' },
      { title: 'TikTok', icon: 'tiktok' },
      { title: 'GitHub', icon: 'github' },
      { title: 'Email', icon: 'at' },
      { title: 'WhatsApp', icon: 'whatsapp' },
      { title: 'Snapchat', icon: 'snapchat' },
      { title: 'Discord', icon: 'discord' },
      { title: 'Twitch', icon: 'twitch' },
      { title: 'Pinterest', icon: 'pinterest-p' },
      { title: 'Telegram', icon: 'telegram' },
      { title: 'Autre', icon: 'link' }
    ];

    await prisma.icon.createMany({
      data: icons
    });
    console.log(`✅ ${icons.length} icônes créées`);

    // ============================================
    // 3. CRÉATION DES LIENS SOCIAUX
    // ============================================
    const links = [
      { title: 'Mon Instagram', url: 'https://instagram.com', icon: 'instagram', id_user: user.id_user },
      { title: 'Mon Twitter', url: 'https://twitter.com', icon: 'x-twitter', id_user: user.id_user },
      { title: 'LinkedIn Pro', url: 'https://linkedin.com', icon: 'linkedin', id_user: user.id_user },
      { title: 'Mon GitHub', url: 'https://github.com', icon: 'github', id_user: user.id_user },
      { title: 'Mon Portfolio', url: 'https://johndoe.com', icon: 'link', id_user: user.id_user }
    ];

    await prisma.link.createMany({
      data: links
    });
    console.log(`✅ ${links.length} liens créés`);

    // ============================================
    // RÉSUMÉ DU SEEDING
    // ============================================
    console.log('\n✨ Seeding terminé avec succès !');
    console.log(`👤 User: ${user.user_name} (ID: ${user.id_user})`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔗 ${links.length} liens`);
    console.log(`🎨 ${icons.length} icônes`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Lancement du seeding
seed();

/**
 * Upload les images de profil depuis le dossier public/assets
 * @param {number} id - ID de l'utilisateur propriétaire des images
 */
async function uploadImages(id) {
  try {
    // Configuration de l'image à uploader
    const imageData={
      name:'avatar_prof_1.png',
    }

    // Chemin absolu vers le fichier image
    const imagePath = path.join(process.cwd(), 'public', 'assets', imageData.name);
    
    // Vérification de l'existence du fichier
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image non trouvée: ${imagePath}`);
      return;
    }

    // Lecture du fichier image et conversion en buffer
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Détection du type MIME basé sur l'extension
    const imageType = imageData.name.endsWith('.png') ? 'image/png' : 'image/jpeg';

    // Création de l'image dans la base de données
    const produit = await prisma.image.create({
      data: {
        name:'profile',
        data: imageBuffer,
        type: imageType,
        id_user:id
      }
    });

    console.log('\n🎉 Toutes les images uploadées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload des images:', error);
  } finally {
    await prisma.$disconnect();
  }
}