import mysql from 'mysql2/promise';

// --- DATABASE CONNECTION FOR THE MAIN APP ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root', // Your MySQL password, if you have one
    database: 'placesuccess_db'
};

let db;
try {
    // This script assumes the database 'placesuccess_db' already exists.
    // The seeder script will create it if it's missing.
    db = await mysql.createConnection(dbConfig);
    console.log('✅ App connected to MySQL database.');
} catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR') {
         console.error(`❌ MySQL Error: The database '${dbConfig.database}' does not exist. Please run 'npm run db:seed' first to create it.`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
         console.error('❌ MySQL Error: Access Denied. Check your DB credentials in the config files.');
    } else {
        console.error('❌ MySQL Connection Error:', error);
    }
    process.exit(1); // Exit if the main app can't connect
}

export { db };