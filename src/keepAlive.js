/**
 * ============================================
 * KEEP-ALIVE - Script de maintien actif du serveur
 * ============================================
 * 
 * Ce script utilise node-cron pour envoyer des requêtes périodiques
 * au serveur afin d'éviter qu'il ne soit mis en veille par les
 * services d'hébergement (ex: Render, Heroku).
 * 
 * @description Ping automatique toutes les 10 minutes
 * @requires node-cron, axios
 */

import cron from "node-cron";
import axios from "axios";

// URL du serveur à ping (défini dans les variables d'environnement)
// Utilisé pour maintenir le service actif 24/7
const SERVER_URL = process.env.RENDER_URL;

// Planification: toutes les 10 minutes (*/10)
// Format: minute heure jour mois jour_semaine
cron.schedule("*/10 * * * *", async () => {
  try {
    // Envoi d'une requête GET au serveur
    const res = await axios.get(SERVER_URL);
    console.log(`[Keep-alive] Ping OK — ${new Date().toISOString()} — status: ${res.status}`);
  } catch (err) {
    // Journalisation des erreurs sans arrêter le service
    console.error(`[Keep-alive] Ping échoué — ${err.message}`);
  }
});