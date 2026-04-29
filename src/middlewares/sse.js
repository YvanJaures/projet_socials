/**
 * ============================================
 * SSE MIDDLEWARE - Server-Sent Events
 * ============================================
 * 
 * Ce middleware permet d'envoyer des mises à jour en temps réel
 * aux clients connectés via le protocole SSE (Server-Sent Events).
 * Utile pour notifier les clients lors de changements (nouveau lien,
 * suppression, mise à jour de profil).
 * 
 * @description Gestion des connexions temps réel avec les clients
 * @module sse
 */

// Ensemble qui stocke toutes les connexions SSE actives
// Permet d'envoyer des messages à tous les clients simultanément
let connexions = new Set();

// Identifiant courant des messages (incrémenté à chaque message)
// Permet aux clients de suivre l'ordre des messages
let currentId = 0;

/**
 * Middleware SSE - Ajoute les méthodes de streaming à la réponse
 * 
 * @returns {Function} Middleware Express
 */
export default function sse() {
    return (request, response, next) => {
        /**
         * Initialiser la connexion SSE avec le client
         * Configure les headers HTTP pour le streaming
         */
        response.initStream = () => {
            // En-têtes pour le protocole SSE
            response.writeHead(200, {
                'Cache-Control': 'no-cache',           // Pas de cache
                'Content-Type': 'text/event-stream',   // Type MIME SSE
                'Connection': 'keep-alive'             // Connexion persistante
            });

            // Ajouter la connexion à l'ensemble des connexions actives
            connexions.add(response);

            // Boucle de keep-alive: envoie un commentaire toutes les 30 secondes
            // Empêche les proxies et navigateurs de fermer la connexion
            const intervalId = setInterval(() => {
                response.write(':\n\n');  // Commentaire SSE (ignoré par le client)
                response.flush();
            }, 30000);

            // Nettoyage quand le client ferme la connexion
            response.on('close', () => {
                connexions.delete(response);
                clearInterval(intervalId);
                response.end();
            });
        };

        /**
         * Envoyer des données JSON à tous les clients connectés
         * 
         * @param {Object} data - Données à envoyer (sérialisées en JSON)
         * @param {string} [eventName] - Nom de l'événement (optionnel)
         */
        response.pushJson = (data, eventName) => {
            // Construction du message au format SSE
            // Format: id: <num>\ndata: <json>\nevent: <nom>\n\n
            let dataString = 
                `id: ${ currentId }\n` + 
                `data: ${ JSON.stringify(data) }\n` + 
                (eventName ? `event: ${ eventName }\n\n` : '\n');

            // Incrémentation de l'ID pour le prochain message
            currentId++;

            // Envoi à toutes les connexions actives
            for(let connexion of connexions){
                connexion.write(dataString);
                connexion.flush();
            }
        };

        // Passage au middleware suivant
        next();
    };
}
            }

            currentId++;
        };

        // Passer au prochain middleware
        next();
    }
}