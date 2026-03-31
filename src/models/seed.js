import bcrypt from 'bcrypt'
import {prisma} from '../prisma.js'
import fs from 'fs'
import path from 'path';

async function seed() {
  try {
    console.log('🌱 Début du seeding...');

    // Hash du mot de passe avec bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('12345678', saltRounds);

    // 1. Créer 1 utilisateur avec mot de passe hashé
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
    // 1.1 Uploader l'image de profil de l'utilisateur
    await uploadImages(user.id_user);
    // 2. Créer 15 icônes
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

    // 3. Créer 5 liens pour cet utilisateur
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

seed();
async function uploadImages(id) {
  await prisma.image.deleteMany()
  try {
    // Liste des images à uploader
    const imageData={
      name:'avatar_prof_1.png',
    }

      // Lire l'image depuis assets
      const imagePath = path.join(process.cwd(), 'public', 'assets', imageData.name);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Image not found: ${imagePath}`);
      }

      // Lire l'image et convertir en base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const imgB=Buffer.from(base64Image,'base64')
      
      
      // Détecter le type d'image
      const imageType = imageData.name.endsWith('.png') ? 'image/png' : 'image/jpeg';

      // Créer le produit avec l'image
      const produit = await prisma.image.create({
        data: {
          name:'profile',
          data: imageBuffer,
          type: imageType,
          id_user:id
        }
      });

    

    console.log('\n🎉 All images uploaded successfully!');
  } catch (error) {
    console.error('❌ Error uploading images:', error);
  } finally {
    await prisma.$disconnect();
  }
}