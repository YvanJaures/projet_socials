/**
 * ============================================
 * PRISMA CLIENT - Connexion à la base de données
 * ============================================
 * 
 * Ce fichier initialise le client Prisma pour interagir avec
 * la base de données SQL Server.
 * 
 * @description Configuration et initialisation du client Prisma
 * @requires @prisma/client, @prisma/adapter-mssql, dotenv
 */

import "dotenv/config";
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from "../generated/prisma/client.js";

// ============================================
// CONFIGURATION DE LA CONNEXION SQL SERVER
// ============================================

const sqlConfig = {
  // Nom d'utilisateur de la base de données
  user: process.env.DB_USER,
  
  // Mot de passe de la base de données
  password: process.env.DB_PASSWORD,
  
  // Nom de la base de données
  database: process.env.DB_NAME,
  
  // Nom du serveur (ou adresse IP)
  server: process.env.DB_SERVER,
  
  // Configuration du pool de connexions
  pool: {
    max: 10,           // Nombre maximum de connexions simultanées
    min: 0,            // Nombre minimum de connexions
    idleTimeoutMillis: 30000  // Timeout d'inactivité (30 secondes)
  },
  
  // Options supplémentaires
  options: {
    // Activation du chiffrement pour Azure
    encrypt: true,
    // Acceptation des certificats auto-signés (pour dev local)
    trustServerCertificate: true
  }
}

// ============================================
// INITIALISATION DU CLIENT PRISMA
// ============================================

// Création de l'adaptateur MS SQL
const adapter = new PrismaMssql(sqlConfig)

// Création du client Prisma avec l'adaptateur
// Log des requêtes, erreurs et avertissements pour le débogage
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'error', 'warn']
});

// Export du client pour utilisation dans les autres fichiers
export { prisma }