import mysql from 'mysql2/promise';
import fs from 'fs';
import csv from 'csv-parser';

// --- DATABASE CONFIGURATION (self-contained for the seeder) ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root', // Your MySQL password, if you have one
};
const dbName = 'placesuccess_db';

// --- DATA FILE PATHS ---
const sheet1Path = './data/2025 placed students details - Sheet1.csv';
const sheet2Path = './data/2025 placed students details - Sheet2.csv';

// --- MAIN SEEDING SCRIPT ---
const runSeed = async () => {
    let connection;
    try {
        // --- Step 1: Connect and Create Database ---
        console.log('--- Step 1: Connecting to MySQL and preparing database ---');
        connection = await mysql.createConnection(dbConfig);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        console.log(`Database '${dbName}' is ready.`);

        // --- Step 2: Define and Create Table Schemas (with no_of_offers) ---
        console.log('\n--- Step 2: Creating tables ---');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS students (
                usn VARCHAR(20) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                branch VARCHAR(50),
                contact_no VARCHAR(15),
                tenth_marks DECIMAL(5, 2),
                twelfth_marks DECIMAL(5, 2),
                be_cgpa DECIMAL(4, 2),
                is_placed BOOLEAN DEFAULT FALSE,
                no_of_offers INT DEFAULT 0,
                highest_package_lpa DECIMAL(5, 2)
            );
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS placements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_usn VARCHAR(20),
                company_name VARCHAR(255) NOT NULL,
                package_lpa DECIMAL(5, 2),
                role VARCHAR(255),
                FOREIGN KEY (student_usn) REFERENCES students(usn) ON DELETE CASCADE
            );
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                location VARCHAR(100),
                type VARCHAR(50),
                category VARCHAR(100),
                status VARCHAR(20) DEFAULT 'Active',
                description TEXT,
                positions INT DEFAULT 1,
                package_range VARCHAR(50),
                deadline DATE,
                applicants INT DEFAULT 0,
                shortlisted INT DEFAULT 0
            );
        `);
        console.log('Tables `students`, `placements`, and `jobs` are ready.');

        // --- Step 3: Read and Process Data from CSVs ---
        console.log('\n--- Step 3: Reading data from CSV files ---');
        const students = new Map();
        const placements = [];

        const stream1 = fs.createReadStream(sheet1Path).pipe(csv({ mapHeaders: ({ header }) => header.trim() }));
        for await (const row of stream1) {
            const usn = row['USN'];
            if (usn && !students.has(usn)) {
                students.set(usn, {
                    name: row['Names'] || 'N/A',
                    email: row['Email ID'] || `${usn}@example.com`,
                    branch: row['Branch'] || null,
                    cgpa: parseFloat(row['BE CGPA']) || null,
                    tenth_marks: parseFloat(row['10th']) || null,
                    twelfth_marks: parseFloat(row['12th']) || null,
                    contact_no: row['Contact NO'] || null,
                });
            }
        }
        console.log(`Found ${students.size} unique students in Sheet1.`);

        const stream2 = fs.createReadStream(sheet2Path).pipe(csv({ mapHeaders: ({ header }) => header.trim() }));
        for await (const row of stream2) {
            if (row['USN'] && row['COMPANY'] && students.has(row['USN'])) {
                placements.push({
                    student_usn: row['USN'],
                    company_name: row['COMPANY'],
                    package_lpa: parseFloat(row['Package']) || 0,
                    role: row['Role'] || null
                });
            }
        }
        console.log(`Found ${placements.length} placement offers in Sheet2.`);

        // --- Step 4: Aggregate Data (highest package AND offer count) ---
        console.log('\n--- Step 4: Aggregating placement data ---');
        const offerCounts = new Map();
        for (const placement of placements) {
            // Increment offer count for the student
            offerCounts.set(placement.student_usn, (offerCounts.get(placement.student_usn) || 0) + 1);

            const student = students.get(placement.student_usn);
            if (student) {
                student.is_placed = true;
                if (!student.highest_package_lpa || student.highest_package_lpa < placement.package_lpa) {
                    student.highest_package_lpa = placement.package_lpa;
                }
            }
        }
        // Add the offer counts to the main student map
        for (const [usn, count] of offerCounts.entries()) {
            if (students.has(usn)) {
                students.get(usn).no_of_offers = count;
            }
        }
        console.log('Calculated highest package and number of offers for each student.');

        // --- Step 5: Safely Populate the Database ---
        console.log('\n--- Step 5: Populating database ---');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.query('TRUNCATE TABLE placements;');
        await connection.query('TRUNCATE TABLE students;');
        await connection.query('TRUNCATE TABLE jobs;');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('Cleared existing data from tables.');

        for (const [usn, student] of students.entries()) {
            await connection.query(
                'INSERT INTO students (usn, name, email, branch, contact_no, tenth_marks, twelfth_marks, be_cgpa, is_placed, no_of_offers, highest_package_lpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [usn, student.name, student.email, student.branch, student.contact_no, student.tenth_marks, student.twelfth_marks, student.cgpa, student.is_placed || false, student.no_of_offers || 0, student.highest_package_lpa || null]
            );
        }
        console.log(`Populated 'students' table with ${students.size} records.`);

        for (const placement of placements) {
            await connection.query(
                'INSERT INTO placements (student_usn, company_name, package_lpa, role) VALUES (?, ?, ?, ?)',
                [placement.student_usn, placement.company_name, placement.package_lpa, placement.role]
            );
        }
        console.log(`Populated 'placements' table with ${placements.length} records.`);

        // Seed a few sample jobs
        await connection.query(
            "INSERT INTO jobs (title, location, type, category, status, description, positions, package_range, deadline, applicants, shortlisted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                'UX Designer','Bangalore','Full-time','Design','Active','Join our design team to create exceptional user experiences for our products.',2,'16-20 LPA','2025-06-01',40,8,
                'Product Manager','Bangalore','Full-time','Product','Active','We\'re seeking Product Managers to drive the vision and execution of our products.',3,'20-26 LPA','2025-06-15',55,12
            ]
        );
        console.log("Seeded sample jobs.");

        console.log('\n✅✅✅ Seeding process completed successfully! ✅✅✅');

    } catch (error) {
        console.error('\n❌ A critical error occurred during the seeding process:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nDatabase connection closed.');
        }
    }
};

// Run the entire process
runSeed();