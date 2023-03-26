const mongoose = require('mongoose');
const mongo = process.env['mongodb']

async function Database() {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(mongo).then(async () => {
        console.log(`[ The Database Has Been Registered ]`);
    }).catch(async (ER) => {
        console.log(`I can't Access The Database\n` + ER);
    })
} Database();