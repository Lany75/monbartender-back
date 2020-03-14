module.exports = {
  OK: 200, // requete traitée avec succès
  CREATED: 201, // requete traitée avec succès et création d'un document
  NO_CONTENT: 204, // requete traitée avec succès mais pas d'information retournée
  PARTIAL_CONTENT: 206, // une partie seulement de la ressource a été transmise
  NOT_MODIFIED: 304, // document non modifié depuis la dernière requete
  BAD_REQUEST: 400, // syntaxe de la requete erronée
  UNAUTHORIZED: 401, // une authentification est nécessaire pour effectuée la requete
  FORBIDDEN: 403, // le serveur a compris la requete mais refuse de l'executer = pas les droits
  NOT_FOUND: 404, // ressource non trouvée
  UNSUPORTED_MEDIA_TYPE: 415, //Format de requete non supportée
  UNPROCESSABLE_ENTITY: 422, // l'entitée fournie avec la requete est incompréhensible ou incomplète
  SERVER_ERROR: 500 // erreur interne du serveur
};
