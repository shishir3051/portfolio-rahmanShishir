require('dotenv').config();
const { query } = require('./db');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createAdmin() {
    console.log('--- Create Initial Admin User ---');

    rl.question('Enter Admin Username: ', (username) => {
        rl.question('Enter Admin Password: ', async (password) => {
            try {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);

                await query('INSERT INTO Admins (Username, PasswordHash) VALUES ($1, $2)', [username, hash]);
                console.log('\nSUCCESS: Admin user created successfully!');
            } catch (err) {
                if (err.code === '23505') {
                    console.error('\nERROR: Username already exists.');
                } else {
                    console.error('\nERROR:', err.message);
                }
            } finally {
                rl.close();
                process.exit();
            }
        });
    });
}

createAdmin();
