/**
 * puerto
 */

 process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */

 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento Token
 */

process.env.CADUCATE_TOKEN = 60 * 60 * 24 * 30; 

 /**
 * SEED
 */

 process.env.SEED = process.env.SEED || 'desarrollo';

/**
 * Base de datos
 */

let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/**
 * Google Client ID
 */

 process.env.CLIENT_ID = process.env.CLIENT_ID ||  '496811129816-pi7cuptg2he38rf9ok3un3uf0gqkmi1j.apps.googleusercontent.com';