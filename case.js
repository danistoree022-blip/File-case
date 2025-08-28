require('./settings');
const fs = require('fs');
const util = require('util')
const chalk = require('chalk')
const crypto = require('crypto')
const { exec } = require("child_process")
const mysql = require('mysql2/promise');
const sftpConfig = require('./sftp-config.json');
const SftpClient = require('ssh2-sftp-client');
const cron = require('node-cron');
const mysqldump = require('mysqldump');
const path = require('path');
const os = require('os')
const axios = require('axios')
const fsx = require('fs-extra')
const ffmpeg = require('fluent-ffmpeg')
const moment = require('moment-timezone')
const { JSDOM } = require('jsdom')
const { color, bgcolor } = require('./lib/color')
const { uptotelegra } = require('./lib/upload')
const { Primbon } = require('scrape-primbon')
const primbon = new Primbon()

function normalizeRecipient(input) {
  if (!input) return m.reply("Recipient kosong");
  const s = String(input).trim();
  if (s.includes("@")) return s;
  if (s.startsWith("lid:")) {
    const lid = s.replace(/^lid:/, "");
    return /@/.test(lid) ? lid : `${lid}@lid`;
  }
  return `${s}@s.whatsapp.net`;
}

module.exports = async (Dapszz, m) => {
try {
const quoted = m.quoted ? m.quoted : m
const body = (m.mtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.mtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.mtype == 'documentMessage') && m.message.documentMessage.caption ? m.message.documentMessage.caption : (m.mtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : ''
const budy = (typeof m.text == 'string' ? m.text : '')
const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><`™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!`™©®Δ^βα¦|/\\©^]/gi) : '.'
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '' //kalau mau no prefix ganti jadi ini : const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const args = body.trim().split(/ +/).slice(1)
const mime = (quoted.msg || quoted).mimetype || ''
const text = q = args.join(" ")
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");
const sender = m.key.fromMe ? Dapszz.user?.id : (isGroup ? m.key.participant : from);
const botNumber = await Dapszz.decodeJid(Dapszz.user.id)
const isOwner = m.sender == owner+"@s.whatsapp.net" ? true : m.sender == botNumber ? true : false
const senderNumber = sender.split('@')[0]
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const groupMetadata = isGroup ? await Dapszz.groupMetadata(m.chat).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
const groupOwner = isGroup ? groupMetadata.owner : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isGroupAdmins = isGroup ? groupAdmins.includes(sender) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false 
const tanggal = moment.tz('Asia/Jakarta').format('DD/MM/YY')
const jam = moment.tz('asia/jakarta').format("HH:mm:ss");
const hariini = moment.tz("Asia/Jakarta").format("dddd, DD MMMM YYYY");
const antilink = JSON.parse(fs.readFileSync('./all/antilink.json'));
const pler = JSON.parse(fs.readFileSync('./all/database/idgrup.json').toString())
const jangan = m.isGroup ? pler.includes(m.chat) : false
 
// Auto Blocked Nomor +212
if (m.sender.startsWith('212')) return Dapszz.updateBlockStatus(m.sender, 'block')

// Random Color
const listcolor = ['red','green','yellow','blue','magenta','cyan','white']
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)]

// Command Yang Muncul Di Console
if (isCmd) {
console.log(chalk.yellow.bgCyan.bold(botname), color(`[ PESAN ]`, `${randomcolor}`), color(`FROM`, `${randomcolor}`), color(`${pushname}`, `${randomcolor}`), color(`Text :`, `${randomcolor}`), color(`${body}`, `white`))
}
// Database
const contacts = JSON.parse(fs.readFileSync("./all/database/contacts.json"))
const prem = JSON.parse(fs.readFileSync("./all/database/premium.json"))
const autopromosi = JSON.parse(fs.readFileSync('./all/autopromosi.json', 'utf8'));


// Cek Database
const isContacts = contacts.includes(sender)
const isPremium = prem.includes(sender)
const isUrl = (url) => {
return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}


async function connectDb() {
    const connection = await mysql.createConnection({
        host: global.hostucp,
        user: global.usernamedb,
        password: global.passworddb,
        database: global.database
    });
    return connection;
}

// Function Reply
const reply = (teks) => { 
Dapszz.sendMessage(from, { text: teks, contextInfo: { 
"externalAdReply": { 
"showAdAttribution": true, 
"title": "DannDevPemula", 
"containsAutoReply": true, 
"mediaType": 1, 
"thumbnail": m, 
"mediaUrl": "https://whatsapp.com/channel/0029Vb5XNRgEquiS1usP452O", 
"sourceUrl": "https://www.youtube.com/@dannsamp" }}}, { quoted: m }) }

if (m.isGroup && isBotAdmins && !m.key.fromMe && antilink) {
  if (body.match(`chat.whatsapp.com`)) {
    setTimeout(() => {
      Dapszz.sendMessage(from, { text:`\`\`\`「 Detect Link 」\`\`\`\n\n@${sender.split("@")[0]} Maaf Link Yang Kamu Kirim Di Dalam Group Ini Akan Di Hapus Oleh Bot`, mentions: [sender]}, { quoted: m })
    }, 1000)
    setTimeout(() => {
      Dapszz.sendMessage(from, { delete: m.key })
    }, 2000)
  }
}

//~~~~~Fitur Case~~~~~//
switch(command) {

case 'menu': {
    const argsMenu = text ? text.toLowerCase() : null;
    const mode = Dapszz.public ? '🌐 Public' : '🔒 Self';
    const uptime = process.uptime();
    const uptimeText = `${Math.floor(uptime / 3600)} Jam, ${Math.floor((uptime % 3600) / 60)} Menit, ${Math.floor(uptime % 60)} Detik`;

    if (!argsMenu) {
        // Menu utama
        return reply(`
╭━━━〔 *🤖 BOT INFORMATION* 〕━━━╮
┃
┃ 👤 *Nama Bot* : BotApaAja
┃ 🛠️ *Developer* : Dann X
┃ 👑 *Owner* : wa.me/6281247159178
┃ ⏱️ *Uptime* : ${uptimeText}
┃ 📡 *Mode* : ${mode}
┃ 💻 *Type* : NodeJs
┃ 🆙 *Version* : V1.6✔︎
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

*––––『 📂 MAIN MENU 』––––*
👑 Owner Menu → *.menu owner*
🎮 SA-MP Server → *.menu server*
👥 Group Menu → *.menu group*
📊 Info & Tools → *.menu info*
🖥️ Pterodactyl Menu → *.menu pterodactyl*
        `);
    }

    if (argsMenu === 'owner') {
        return reply(`
*––––『 👑 OWNER MENU 』––––*
• mode
• ping
        `);
    }

    if (argsMenu === 'server') {
        return reply(`
*––––『 🎮 SA-MP SERVER 』––––*
• wl
• unwl
• daftarwl
• cekakun
• infoakun
• setcs
• uncs
• setadmin
• deladmin
• listadmin
• setmoney
• setlevel
• setpass
• player
• status
• ip
• serverinfo
        `);
    }

    if (argsMenu === 'group') {
        return reply(`
*––––『 👥 GROUP MENU 』––––*
• 
        `);
    }

    if (argsMenu === 'info') {
        return reply(`
*––––『 📊 INFO & TOOLS 』––––*
• help
• menu
        `);
    }

    if (argsMenu === 'pterodactyl') {
        return reply(`
*––––『 🖥️ PTERODACTYL MENU 』––––*
• samplinux
• sampwindows
        `);
    }

    return reply("❌ Kategori tidak ditemukan.\nGunakan: *.menu owner/server/group/info/pterodactyl*");
}
break;

case 'help': {
    const helpCommands = {
        wl: {
            description: 'Mendaftarkan akun & whitelist ke dalam server.',
            category: 'Public',
            usage: '.wl Zuarenz_Montefalco'
        },
        unwl: {
            description: 'Menghapus akun player dari database server.',
            category: 'Owner',
            usage: '.unwl Zuarenz_Montefalco'
        },
        daftarwl: {
            description: 'Menampilkan daftar semua akun yang sudah di-whitelist.',
            category: 'Admin',
            usage: '.daftarwl'
        },
        player: {
            description: 'Menampilkan jumlah player yang terdaftar.',
            category: 'Public',
            usage: '.player'
        },
        status: {
            description: 'Cek status bot dan server.',
            category: 'Public',
            usage: '.status'
        },
        ip: {
            description: 'Menampilkan alamat IP server.',
            category: 'Public',
            usage: '.ip'
        },
        setcs: {
            description: 'Mengaktifkan CS untuk player di database.',
            category: 'Admin',
            usage: '.setcs Zuarenz_Montefalco'
        },
        uncs: {
            description: 'Menonaktifkan CS untuk player di database.',
            category: 'Admin',
            usage: '.uncs Zuarenz_Montefalco'
        }, 
        cekakun: {
            description: 'Menampilkan informasi lengkap akun player.',
            category: 'Admin',
            usage: '.cekakun Zuarenz_Montefalco'
        },
        setpass: {
            description: 'Mengganti password akun di database. Hanya bisa digunakan jika akun sudah whitelist.',
            category: 'Public',
            usage: '.setpass passwordnew'
        },
        infoakun: {
            description: 'Menampilkan informasi akun kamu sendiri.',
            category: 'Public',
            usage: '.infoakun'
        }, 
        setadmin: {
            description: 'Memberikan admin ke akun player.',
            category: 'Owner',
            usage: '.setadmin Zuarenz_Montefalco 5 key'
        },
        deladmin: {
            description: 'Menghapus status admin dari player.',
            category: 'Owner',
            usage: '.deladmin Zuarenz_Montefalco key'
        },
        listadmin: {
            description: 'Menampilkan daftar semua admin di server.',
            category: 'Owner',
            usage: '.listadmin'
        },
        setmoney: {
            description: 'Memberikan atau mengubah jumlah uang player di database.',
            category: 'Admin',
            usage: '.setmoney Zuarenz_Montefalco 1000000'
        },
        setlevel: {
            description: 'Mengatur level player di database.',
            category: 'Admin',
            usage: '.setlevel Zuarenz_Montefalco 10'
        },
        serverinfo: {
            description: 'Menampilkan informasi server seperti ip dan lain".',
            category: 'Public',
            usage: '.serverinfo'
        },
        topplayer: {
            description: 'Menampilkan informasi pemain-pemain top.',
            category: 'Public',
            usage: '.leaderboard'
        }        
    };

    if (!q) {
        // Menampilkan semua nama command
        let helpText = `📖 *List Command*\n\n`;
        for (const cmd of Object.keys(helpCommands)) {
            helpText += `• .${cmd}\n`;
        }
        helpText += `\nKetik: .help <nama_perintah>\nUntuk melihat detail lebih lanjut.`;
        return m.reply(helpText);
    } else {
        // Menampilkan detail satu command
        const cmd = q.trim().toLowerCase();
        if (helpCommands[cmd]) {
            const info = helpCommands[cmd];
            return m.reply(`📖 *Help: .${cmd}*\n\n📝 *Description:*\n${info.description}\n\n📂 *Category:* ${info.category}\n📌 *Usage:*\n${info.usage}`);
        } else {
            return m.reply(`Command ".${cmd}" tidak ditemukan.\nGunakan .help untuk melihat semua command.`);
        }
    }
}
break;

case "mode": {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');

    Dapszz.public = !Dapszz.public // toggle mode
    let modeText = Dapszz.public ? "PUBLIC" : "SELF"

    reply(`✅ Bot berhasil diganti ke mode *${modeText}*.`)
    console.log(`[MODE] Bot sekarang di ${modeText} mode`)
}
break

          case 'wl': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const wlGroupId = sftpConfig.wlgrup; // ID grup whitelist

    // Pastikan hanya bisa digunakan di grup whitelist
    if (m.chat !== wlGroupId) {
        return reply('Perintah ini hanya bisa digunakan di *grup whitelist*.');
    }

    if (!text) return reply(`Kirim perintah:\n${prefix}wl [ Nama ]\nContoh: .wl Axell_Carrasquillo`);

    const nama = text.trim();
    const nomorTelepon = m.sender.split('@')[0];

    function isToxic(name) {
        const toxicWords = require('./toxic.json');
        return toxicWords.some(word => name.toLowerCase().includes(word.toLowerCase()));
    }

    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json'));
    }

    const existingNumber = Object.keys(database).find(number => database[number] === nama);
    if (existingNumber) {
        return reply(`⚠️ Nama "${nama}" sudah digunakan oleh nomor ${existingNumber}.`);
    }

    if (nama.length < 5 || nama.length > 20) {
        return reply(`⚠️ Panjang nama "${nama}" tidak valid. (Minimal 5, Maksimal 20 karakter).`);
    }

    if (database[nomorTelepon]) {
        return reply('⚠️ Nomormu sudah whitelist sebelumnya.');
    }

    if (isToxic(nama)) {
        return reply('Nama mengandung kata-kata terlarang.');
    }

    const wlFilePath = `${global.sftppath}${nama}.${global.jenisfile}`;

    try {
        const sftp = new SftpClient();

        await sftp.connect({
            host: global.host,
            port: global.port,
            username: global.username,
            password: global.password
        });

        await sftp.put(Buffer.from(''), wlFilePath, { mode: 0o644 });
        await sftp.append(Buffer.from(`${nama}\n`), wlFilePath);

        await sftp.end();

        database[nomorTelepon] = nama;
        fs.writeFileSync('database.json', JSON.stringify(database, null, 2));

        reply(`
╭━━━『 🎉 *PENDAFTARAN BERHASIL* 🎉 』━━━╮

✨ *Selamat Datang, Warga ${global.NameServerLite}!*  
Nama karakter kamu berhasil didaftarkan ke whitelist server kami.  

📛 *Nama Karakter:* ${nama}  
🌐 *IP Server:* ${global.IpServer}:${global.PortServer}

📜 *Petunjuk:*  
Gunakan nama karakter di atas saat registrasi di dalam game. Pastikan nama sesuai dan tidak melanggar peraturan server.

⚠️ *PENTING:*  
🔒 Jangan pernah membagikan password akun kepada siapapun.  
🛡️ Staff dan admin TIDAK akan pernah meminta passwordmu.

🎯 *Selamat bermain di ${global.NameServerFull}!*  
Hidupkan cerita & roleplay terbaikmu di kota ini.  

╰━━━『 🚀 ${global.NameServerFull} 』━━━╯
    `);
    } catch (error) {
        console.error(error);
        reply('Terjadi kesalahan saat whitelist.');
    }
}
break;

case 'unwl': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup; // ID grup admin

    // Pastikan hanya bisa digunakan di grup admin
    if (m.chat !== adminGroupId) {
        return reply('Perintah ini hanya bisa digunakan di *grup admin*.');
    }

    if (!text) return reply(`Kirim perintah:\n${prefix}unwl [nama]`);

    const nama = text.trim();

    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json'));
    }

    const nomorTelepon = Object.keys(database).find(key => database[key] === nama);
    if (!nomorTelepon) {
        return reply(`⚠️ Nama "${nama}" tidak ditemukan di whitelist.`);
    }

    delete database[nomorTelepon];
    fs.writeFileSync('database.json', JSON.stringify(database, null, 2));

    try {
        const sftp = new SftpClient();

        await sftp.connect({
            host: global.host,
            port: global.port,
            username: global.username,
            password: global.password
        });

        const wlFilePath = `${global.sftppath}${nama}.${global.jenisfile}`;
        await sftp.delete(wlFilePath);

        await sftp.end();

        reply(`Nama "${nama}" berhasil dihapus dari whitelist.`);
    } catch (error) {
        console.error(error);
        reply('Terjadi kesalahan saat menghapus whitelist.');
    }
}
break;

case 'uncs': {
	const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;
    if (m.chat !== adminGroupId) {
        return reply('Perintah ini hanya bisa digunakan di *grup admin*.');
    }
    if (!m.isGroup) return m.reply('Perintah ini hanya dapat digunakan di dalam grup.');

    if (!q) return m.reply('Contoh: .uncs Zuarenz_Montefalco');

    const nama = q.trim();

    const connection = await connectDb();
    const [rows] = await connection.execute('SELECT * FROM accounts WHERE pName = ?', [nama]);

    if (rows.length === 0) {
        connection.end();
        return m.reply(`Player "${nama}" tidak ditemukan di database.`);
    }

    await connection.execute('UPDATE accounts SET pCS = ? WHERE pName = ?', [0, nama]);
    connection.end();

    return m.m.reply(`Berhasil menghapus CS untuk ${nama}.`);
}
break;

/*case 'cekakun': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;
    if (m.chat !== adminGroupId) {
        return reply('Perintah ini hanya bisa digunakan di *grup admin*.');
    }
    
    if (!q) return reply(`Masukkan nama player.\nContoh: .cekakun Zuarenz_Coyy`);

    const playerName = q.trim();

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT * FROM accounts WHERE pName = ? LIMIT 1',
            [playerName]
        );
        connection.end();

        if (rows.length === 0) {
            return reply(`Akun *${playerName}* tidak ditemukan di database.`);
        }

        const akun = rows[0];

        // Format VIP
        let vipStatus = 'Tidak Ada';
        if (akun.pVip == 1) vipStatus = '🥉 VIP Bronze';
        if (akun.pVip == 2) vipStatus = '🥈 VIP Silver';
        if (akun.pVip == 3) vipStatus = '🥇 VIP Diamond';

        // Format Family
        let familyStatus = 'Tidak Ada';
        if (akun.pFamily && akun.pFamily !== 'NULL') familyStatus = akun.pFamily;

        // Format ke Rupiah
        function formatRupiah(angka) {
            return 'Rp' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        let textInfo = `
📋 *DATA PLAYER: ${akun.pName}*

❤️ *Darah:* ${akun.pHealth}
🛡️ *Vest:* ${akun.pVest}
💸 *Cash:* ${formatRupiah(akun.pCash)}
🏦 *Uang di Bank:* ${formatRupiah(akun.pBank)}
🧍‍♂️ *Skin ID:* ${akun.pSkin}
🎖️ *Level (Umur):* ${akun.pLevel}
💊 *Narkoba:* ${akun.pNarkoba}
🪙 *Rouble:* ${akun.pRouble}
👑 *VIP:* ${vipStatus}
👨‍👩‍👧‍👦 *Family:* ${familyStatus}

*Data berhasil diambil dari database.*
        `;

        return reply(textInfo);

    } catch (error) {
        console.error(error);
        return reply('Terjadi kesalahan saat mengambil data akun.');
    }
}
break;*/

case 'setpass': {
    if (m.isGroup) return reply('Perintah ini hanya bisa digunakan di chat pribadi. Silahkan kirim perintah ini ke bot.');

    if (!q) return reply('Masukkan password baru!\nContoh: .setpass password_baru');

    const newPassword = q.trim();
    const nomorTelepon = m.sender.split('@')[0]; // Ambil nomor WA pengirim

    // Baca database.json
    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
    }

    // Periksa apakah nomor sudah terdaftar whitelist
    if (!database[nomorTelepon]) {
        return reply(`Nomor kamu belum terdaftar di whitelist.\n\n💬 Silahkan daftar dulu menggunakan:\n.wl [Nama_Player]\nContoh: .wl John_Doe`);
    }

    const playerName = database[nomorTelepon];

    // ======== fungsi gensalt =========
    function gensalt(length = 5) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let salt = '';
        for (let i = 0; i < length; i++) {
            salt += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return salt;
    }

    // ======== fungsi hashit =========
    const crypto = require('crypto');
    function hashit(salt, password) {
        const md5 = str => crypto.createHash('md5').update(str).digest('hex').toLowerCase();
        const step1 = md5(salt);       // hash salt
        const step2 = md5(password);   // hash password
        const combined = step1 + step2; // gabungkan
        const finalHash = md5(combined); // hash lagi
        return finalHash;
    }

    const salt = gensalt();
    const hashedPassword = hashit(salt, newPassword);

    try {
        const connection = await connectDb();

        // Update password & salt di database
        await connection.execute(
            'UPDATE accounts SET pPassword = ?, pass_salt = ? WHERE pName = ?',
            [hashedPassword, salt, playerName]
        );
        connection.end();

        reply(`
*Password Berhasil Diubah!*

👤 Nama Player: *${playerName}*
🔑 Password Baru: *${newPassword}*

📌 *Note:* Jangan bagikan password ini kepada siapapun untuk menjaga keamanan akun Anda.

✨ Selamat bermain di ${global.NameServerFull}!
        `);
    } catch (error) {
        console.error(error);
        reply('Terjadi kesalahan saat mengubah password. Silahkan coba lagi nanti.');
    }
}
break;

          case 'status': {
              let sampApiUrl = `https://pablonetwork.cyclic.app/API/samp?key=pablo&host=${global.IpServer}&port=${global.PortServer}`

              try {
                  let response = await axios(sampApiUrl)
                  let sampInfo = response.data;

                  // Mengambil nilai dari properti yang diinginkan
                  let serverIP = sampInfo.response.serverip;
                  let address = sampInfo.response.address;
                  let gamemode = sampInfo.response.gamemode;
                  let playerOnline = sampInfo.response.isPlayerOnline;
                  let maxPlayers = sampInfo.response.maxplayers;
                  let hostname = sampInfo.response.hostname;
                  let language = sampInfo.response.language;
                  let lagCompensation = sampInfo.response.rule.lagcomp;
                  let mapName = sampInfo.response.rule.mapname;
                  let version = sampInfo.response.rule.version;
                  let weather = sampInfo.response.rule.weather;
                  let webUrl = sampInfo.response.rule.weburl;
                  let worldTime = sampInfo.response.rule.worldtime;

                  // Menampilkan hasil ke pengguna dengan tata letak yang lebih rapi dan pemisahan menggunakan ":"
                  let result = `
> Now Server Is Online 🟢.`;

                  // Menampilkan informasi pemain online (jika ada)
                  reply(result);
              } catch (error) {
                  console.error(error);
                  reply('> Now Server Is Offline 🔴.');
              }
          }
          break;

case 'ip': {
    let IpMessage = `
━━━━━━━━━━━━━━━
🌐 *IP SERVER KAMI* 🌐
━━━━━━━━━━━━━━━
📡 *Alamat IP*: ${global.IpServer}
📶 *Port*: ${global.PortServer}

*Segera join dan rasakan keseruannya!*
📢 Jangan lupa ajak teman-temanmu untuk bermain bersama.

🔥 *Ayo gabung sekarang juga!* 🔥
━━━━━━━━━━━━━━━
    `;
    reply(IpMessage);
}
break;

/*case 'infoakun': {
    // Cek whitelist di database.json
    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
    }

    const nomorTelepon = m.sender.split('@')[0]; // Nomor WA user

    if (!database[nomorTelepon]) {
        return m.reply('Kamu belum whitelist.\n\nGunakan perintah *.wl <Nama_Karakter>* untuk daftar terlebih dahulu.');
    }

    const playerName = database[nomorTelepon];

    try {
        const sftp = new SftpClient();
        await sftp.connect({
            host: global.host,
            port: global.port,
            username: global.username,
            password: global.password
        });

        const filePath = `${global.sftppath}/accounts/${playerName}.json`;

        if (!(await sftp.exists(filePath))) {
            await sftp.end();
            return m.reply(`Akun *${playerName}* tidak ditemukan di database.`);
        }

        const fileBuffer = await sftp.get(filePath);
        const akun = JSON.parse(fileBuffer.toString());

        // Format VIP
        let vipStatus = 'Tidak Ada';
        if (akun.pVip == 1) vipStatus = '🥉 VIP Bronze';
        if (akun.pVip == 2) vipStatus = '🥈 VIP Silver';
        if (akun.pVip == 3) vipStatus = '🥇 VIP Diamond';

        let textInfo = `
╭─── 「 👤 *INFO AKUN* 」 ───╮
│ 📛 *Nama Akun:* ${akun.pName}
│ 🏆 *Level:* ${akun.pLevel}
│ 💵 *Cash:* Rp ${Number(akun.pCash).toLocaleString('id-ID')}
│ 🏦 *Bank:* Rp ${Number(akun.pBank).toLocaleString('id-ID')}
│ 👑 *VIP:* ${vipStatus}
╰─────────────────────────╯

✨ *Selamat bermain di ${global.NameServerFull}!*
Jaga akunmu baik-baik dan *jangan bagikan password kepada siapapun!*
        `;

        await sftp.end();
        return m.reply(textInfo);

    } catch (error) {
        console.error(error);
        return m.reply('Terjadi kesalahan saat mengambil data akun.');
    }
}
break;*/

          case 'player': {
              let sampApiUrl = `https://pablonetwork.cyclic.app/API/samp?key=pablo&host=${global.IpServer}&port=${global.PortServer}`

              try {
                  let response = await axios(sampApiUrl)
                  let sampInfo = response.data;

                  // Mengambil nilai dari properti yang diinginkan
                  let serverIP = sampInfo.response.serverip;
                  let address = sampInfo.response.address;
                  let gamemode = sampInfo.response.gamemode;
                  let playerOnline = sampInfo.response.isPlayerOnline;
                  let maxPlayers = sampInfo.response.maxplayers;
                  let hostname = sampInfo.response.hostname;
                  let language = sampInfo.response.language;
                  let lagCompensation = sampInfo.response.rule.lagcomp;
                  let mapName = sampInfo.response.rule.mapname;
                  let version = sampInfo.response.rule.version;
                  let weather = sampInfo.response.rule.weather;
                  let webUrl = sampInfo.response.rule.weburl;
                  let worldTime = sampInfo.response.rule.worldtime;

                  // Menampilkan hasil ke pengguna dengan tata letak yang lebih rapi dan pemisahan menggunakan ":"
                  let result = `
*${hostname}*

> IP:PORT:
> ${serverIP}

> Hostname:
> ${hostname}

> Player Online: 
> ${playerOnline}

> Max Players: 
> ${maxPlayers}`;

                  // Menampilkan informasi pemain online (jika ada)
                  reply(result);
              } catch (error) {
                  console.error(error);
                  reply('> Now Server Is Offline 🔴.');
              }
          }
          break;
          
          case "sc" :
          case "script": {
          const text12 = `SCRIPT INI DIJUAL INGIN MEMBELI/PREVIEW SC? BISA LANGSUNG CHAT OWNER INI NOMOR NYA wa.me/6282197668388`
          reply(text12)
          }
          break;
          
          case 'getid': {
              
              if (!m.isGroup) return; // Pastikan perintah hanya dapat digunakan di grup

              // Kirim ID grup ke pengguna
              reply(`ID grup ini adalah: ${m.chat}`);
          }
          break;

/*case 'topplayer': {
    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT pName, pCash FROM accounts ORDER BY pCash DESC LIMIT 10'
        );
        connection.end();

        if (rows.length === 0) {
            return m.reply('Tidak ada data player yang ditemukan di database.');
        }

        let leaderboard = `🏆 *TOP 10 PLAYER TERKAYA*\n\n`;
        rows.forEach((player, index) => {
            leaderboard += `*${index + 1}. ${player.pName}*\n💵 Rp ${Number(player.pCash).toLocaleString('id-ID')}\n\n`;
        });
        leaderboard += `✨ *Selamat bermain di ${global.NameServerFull}!*`;

        return m.reply(leaderboard);

    } catch (error) {
        console.error(error);
        return m.reply('Terjadi kesalahan saat mengambil data top player.');
    }
}
break;*/

case 'leaderboard': {
    const args = text.trim().toLowerCase();
    const kategori = args === 'money' || args === 'level' ? args : null;

    if (!kategori) {
    return m.reply(`
*––––『 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 』––––*

🔖 ᴛʏᴩᴇ ʟɪsᴛ :
⮕ 💰 - money
⮕ 🏆 - level

––––––––––––––––––––––––
💁🏻‍♂ *ᴛɪᴩ* :
⮕ ᴛᴏ ᴠɪᴇᴡ ᴅɪғғᴇʀᴇɴᴛ ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ:  
.leaderboard [type]

✨ *ᴇxᴀᴍᴩʟᴇ:*  
.leaderboard money
    `.trim());
}

    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
    }
    const nomorWA = m.sender.split('@')[0];
    const playerName = database[nomorWA];

    if (!playerName) {
        return m.reply(`Kamu belum whitelist.\nGunakan perintah *.wl <Nama_Karakter>* untuk daftar.`);
    }

    try {
        const connection = await connectDb();
        let query = '';
        if (kategori === 'money') {
            query = 'SELECT pName, pCash FROM accounts ORDER BY pCash DESC';
        } else if (kategori === 'level') {
            query = 'SELECT pName, pLevel FROM accounts ORDER BY pLevel DESC';
        }

        const [rows] = await connection.execute(query);
        connection.end();

        if (rows.length === 0) {
            return m.reply(`Data player tidak ditemukan di database.`);
        }

        // Cari rank player sekarang
        let rankUser = rows.findIndex(row => row.pName.toLowerCase() === playerName.toLowerCase()) + 1;
        let totalPlayer = rows.length;

        let leaderboard = `🏆 *RANK: ${rankUser} OUT OF ${totalPlayer}*\n\n`;
        leaderboard += kategori === 'money' ? `💰 *TOP 5 RICHEST PLAYERS*\n\n` : `🎖️ *TOP 5 HIGHEST LEVELS*\n\n`;

        rows.slice(0, 5).forEach((player, index) => {
            const nomor = Object.keys(database).find(key => database[key] === player.pName) || 'Nomor tidak ditemukan';
            leaderboard += `${index + 1}. *${kategori === 'money' ? 'Rp ' + Number(player.pCash).toLocaleString('id-ID') : 'Level ' + player.pLevel}* - ${player.pName}\n📱 wa.me/${nomor}\n\n`;
        });

        leaderboard += kategori === 'money' ? '✨ Siapakah yang akan jadi Sultan berikutnya?\n' : '🔥 Siapakah yang akan mencapai Level Max?\n';

        return m.reply(leaderboard);

    } catch (err) {
        console.error(err);
        return m.reply('Terjadi kesalahan saat mengambil leaderboard.');
    }
}
break;

case 'infoakun': {
    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
    }

    const nomorTelepon = m.sender.split('@')[0];
    if (!database[nomorTelepon]) {
        return m.reply('Kamu belum whitelist.\n\nGunakan perintah *.wl <Nama_Karakter>* untuk daftar terlebih dahulu.');
    }

    const playerName = database[nomorTelepon].trim();

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT pName, pLevel, pCash, pBank, pVip FROM accounts WHERE LOWER(pName) = LOWER(?) LIMIT 1',
            [playerName]
        );
        connection.end();

        if (rows.length === 0) {
            return m.reply(`Akun *${playerName}* tidak ditemukan di database.`);
        }

        const akun = rows[0];

        let vipStatus = 'Tidak Ada';
        if (akun.pVip == 1) vipStatus = '🥉 VIP Bronze';
        if (akun.pVip == 2) vipStatus = '🥈 VIP Silver';
        if (akun.pVip == 3) vipStatus = '🥇 VIP Diamond';

        let textInfo = `
╭─── 「 👤 *INFO AKUN* 」 ───╮
│ 📛 *Nama Akun:* ${akun.pName}
│ 🏆 *Level:* ${akun.pLevel}
│ 💵 *Cash:* Rp ${Number(akun.pCash).toLocaleString('id-ID')}
│ 🏦 *Bank:* Rp ${Number(akun.pBank).toLocaleString('id-ID')}
│ 👑 *VIP:* ${vipStatus}
╰─────────────────────────╯

✨ *Selamat bermain di ${global.NameServerFull}!*
Jaga akunmu baik-baik dan *jangan bagikan password kepada siapapun!*
        `;
        return m.reply(textInfo);

    } catch (error) {
        console.error(error);
        return m.reply('Terjadi kesalahan saat mengambil data akun.');
    }
}
break;

case 'serverinfo': {
    let text = `
🧾 *Server Info : ${global.NameServerFull}*

> 🌐 *Address* : ${global.IpServer}:${global.PortServer}
> 💸 *Mata Uang* : Rupiah
> 🔥 *Gamemode* : Inferno
> 📌 *Status* : Online 24/7

✨ Selamat bermain di *${global.NameServerLite}*!
    `;
    return m.reply(text);
}
break;

function GetVehicleName(id) {
    const vehicles = {
        400: "Landstalker",
        401: "Bravura",
        402: "Buffalo",
        403: "Linerunner",
        404: "Pereniel",
        405: "Sentinel",
        406: "Dumper",
        407: "Firetruck",
        408: "Trashmaster",
        409: "Stretch",
        410: "Manana",
        411: "Infernus",
        412: "Voodoo",
        413: "Pony",
        414: "Mule",
        415: "Cheetah",
        416: "Ambulance",
        417: "Leviathan",
        418: "Moonbeam",
        419: "Esperanto",
        420: "Taxi",
        421: "Washington",
        422: "Bobcat",
        423: "Mr Whoopee",
        424: "BF Injection",
        425: "Hunter",
        426: "Premier",
        427: "Enforcer",
        428: "Securicar",
        429: "Banshee",
        430: "Predator",
        431: "Bus",
        432: "Rhino",
        433: "Barracks",
        434: "Hotknife",
        435: "Trailer 1",
        436: "Previon",
        437: "Coach",
        438: "Cabbie",
        439: "Stallion",
        440: "Rumpo",
        441: "RC Bandit",
        442: "Romero",
        443: "Packer",
        444: "Monster",
        445: "Admiral",
        446: "Squalo",
        447: "Seasparrow",
        448: "Pizzaboy",
        449: "Tram",
        450: "Trailer 2",
        451: "Turismo",
        452: "Speeder",
        453: "Reefer",
        454: "Tropic",
        455: "Flatbed",
        456: "Yankee",
        457: "Caddy",
        458: "Solair",
        459: "Topfun Van (Berkley’s RC)",
        460: "Skimmer",
        461: "PCJ-600",
        462: "Faggio",
        463: "Freeway",
        464: "RC Baron",
        465: "RC Raider",
        466: "Glendale",
        467: "Oceanic",
        468: "Sanchez",
        469: "Sparrow",
        470: "Patriot",
        471: "Quadbike",
        472: "Coastguard",
        473: "Dinghy",
        474: "Hermes",
        475: "Sabre",
        476: "Rustler",
        477: "ZR-350",
        478: "Walton",
        479: "Regina",
        480: "Comet",
        481: "BMX",
        482: "Burrito",
        483: "Camper",
        484: "Marquis",
        485: "Baggage",
        486: "Dozer",
        487: "Maverick",
        488: "News Chopper",
        489: "Rancher",
        490: "FBI Rancher",
        491: "Virgo",
        492: "Greenwood",
        493: "Jetmax",
        494: "Hotring Racer",
        495: "Sandking",
        496: "Blista Compact",
        497: "Police Maverick",
        498: "Boxville",
        499: "Benson",
        500: "Mesa",
        501: "RC Goblin",
        502: "Hotring Racer A",
        503: "Hotring Racer B",
        504: "Bloodring Banger",
        505: "Rancher Lure",
        506: "Super GT",
        507: "Elegant",
        508: "Journey",
        509: "Bike",
        510: "Mountain Bike",
        511: "Beagle",
        512: "Cropduster",
        513: "Stuntplane",
        514: "Tanker",
        515: "Roadtrain",
        516: "Nebula",
        517: "Majestic",
        518: "Buccaneer",
        519: "Shamal",
        520: "Hydra",
        521: "FCR-900",
        522: "NRG-500",
        523: "HPV1000",
        524: "Cement Truck",
        525: "Tow Truck",
        526: "Fortune",
        527: "Cadrona",
        528: "FBI Truck",
        529: "Willard",
        530: "Forklift",
        531: "Tractor",
        532: "Combine Harvester",
        533: "Feltzer",
        534: "Remington",
        535: "Slamvan",
        536: "Blade",
        537: "Freight (Train)",
        538: "Brownstreak (Train)",
        539: "Vortex",
        540: "Vincent",
        541: "Bullet",
        542: "Clover",
        543: "Sadler",
        544: "Firetruck LA",
        545: "Hustler",
        546: "Intruder",
        547: "Primo",
        548: "Cargobob",
        549: "Tampa",
        550: "Sunrise",
        551: "Merit",
        552: "Utility Van",
        553: "Nevada",
        554: "Yosemite",
        555: "Windsor",
        556: "Monster A",
        557: "Monster B",
        558: "Uranus",
        559: "Jester",
        560: "Sultan",
        561: "Stratum",
        562: "Elegy",
        563: "Raindance",
        564: "RC Tiger",
        565: "Flash",
        566: "Tahoma",
        567: "Savanna",
        568: "Bandito",
        569: "Freight Flat Trailer (Train)",
        570: "Streak Trailer (Train)",
        571: "Kart",
        572: "Mower",
        573: "Dune",
        574: "Sweeper",
        575: "Broadway",
        576: "Tornado",
        577: "AT-400",
        578: "DFT-30",
        579: "Huntley",
        580: "Stafford",
        581: "BF-400",
        582: "Newsvan",
        583: "Tug",
        584: "Trailer 3",
        585: "Emperor",
        586: "Wayfarer",
        587: "Euros",
        588: "Hotdog",
        589: "Club",
        590: "Freight Box Trailer (Train)",
        591: "Trailer 4",
        592: "Andromada",
        593: "Dodo",
        594: "RC Cam",
        595: "Launch",
        596: "Police Car (LSPD)",
        597: "Police Car (SFPD)",
        598: "Police Car (LVPD)",
        599: "Ranger",
        600: "Picador",
        601: "S.W.A.T.",
        602: "Alpha",
        603: "Phoenix",
        604: "Glendale Shit",
        605: "Sadler Shit",
        606: "Baggage Trailer A",
        607: "Baggage Trailer B",
        608: "Tug Stairs Trailer",
        609: "Boxville Mission",
        610: "Farm Trailer",
        611: "Utility Trailer"
    };
    return vehicles[id] || "Unknown";
}

function GetWeaponName(id) {
    const weapons = {
        0: "Fist",
        1: "Brass Knuckles",
        2: "Golf Club",
        3: "Nightstick",
        4: "Knife",
        5: "Baseball Bat",
        6: "Shovel",
        7: "Pool Cue",
        8: "Katana",
        9: "Chainsaw",
        10: "Purple Dildo",
        11: "Dildo",
        12: "Vibrator",
        13: "Silver Vibrator",
        14: "Flowers",
        15: "Cane",
        16: "Grenade",
        17: "Tear Gas",
        18: "Molotov Cocktail",
        22: "Colt 45",
        23: "Silenced 9mm",
        24: "Desert Eagle",
        25: "Shotgun",
        26: "Sawn-Off Shotgun",
        27: "Combat Shotgun",
        28: "Micro Uzi",
        29: "MP5",
        30: "AK-47",
        31: "M4",
        32: "Tec-9",
        33: "Country Rifle",
        34: "Sniper Rifle",
        35: "Rocket Launcher",
        36: "Heat Seeking Rocket Launcher",
        37: "Flamethrower",
        38: "Minigun",
        39: "Satchel Charges",
        40: "Detonator",
        41: "Spray Can",
        42: "Fire Extinguisher",
        43: "Camera",
        44: "Night Vision Goggles",
        45: "Thermal Goggles",
        46: "Parachute"
    };
    return weapons[id] || "Unknown";
}

case 'cekakun': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;
    if (m.chat !== adminGroupId) {
        return reply('Perintah ini hanya bisa digunakan di *grup admin*.');
    }
    
    if (!q) return reply(`Masukkan nama player.\nContoh: .cekakun Zuarenz_Montefalco`);

    const playerName = q.trim();

    // Load database.json
    let database = {};
    if (fs.existsSync('database.json')) {
        database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
    }

    // Cari nomor WA dari database.json
    const nomorWA = Object.keys(database).find(nomor => database[nomor] === playerName) || 'Nomor WA tidak ditemukan';

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT * FROM accounts WHERE pName = ? LIMIT 1',
            [playerName]
        );
        connection.end();

        if (rows.length === 0) {
            return reply(`Akun *${playerName}* tidak ditemukan di database.`);
        }

        const akun = rows[0];
        const kendaraan = akun.cModel.split(',')
            .filter(id => id != 0)
            .map(id => `- ${id} (${GetVehicleName(parseInt(id))})`).join('\n') || 'Tidak Ada';
        const senjata = akun.pGun.split(',')
            .map(id => `- ${id} (${GetWeaponName(parseInt(id))})`).join('\n');

        let info = `
👤 *Info Akun ${akun.pName}:*

📱 Nomor WA: ${nomorWA}
💵 Uang: Rp ${Number(akun.pCash).toLocaleString('id-ID')}
🎖️ Level: ${akun.pLevel}
🧥 Skin: ${akun.pSkin}
🏠 Rumah: ${akun.pHouse > 0 ? `Ada (ID: ${akun.pHouse})` : 'Tidak Ada'}
💎 Rouble: ${akun.pRouble}
📖 Character Story: ${akun.pCS == 1 ? 'Aktif' : 'Nonaktif'}

🚗 Kendaraan:
${kendaraan}

🔫 Senjata:
${senjata}
        `;

        return m.reply(info);

    } catch (err) {
        console.error(err);
        return m.reply('Terjadi kesalahan saat mengambil data akun.');
    }
}
break;

/*case 'setadmin': {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');
    const [targetName, targetLevel, targetKey] = text.split(' ');

    if (!targetName || !targetLevel || !targetKey) {
        return m.reply(`Contoh penggunaan:\n.setadmin Kalz_Toretto 200 secretKey`);
    }

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute('SELECT * FROM accounts WHERE pName = ?', [targetName]);

        if (rows.length === 0) {
            connection.end();
            return m.reply(`Player "${targetName}" tidak ditemukan di database.`);
        }

        // Cek apakah admin sudah ada
        const [adminRows] = await connection.execute('SELECT * FROM admin WHERE Name = ?', [targetName]);

        if (adminRows.length === 0) {
            // Insert admin baru
            await connection.execute(
                `INSERT INTO admin (
                    Name, pAdmin, pAname, pAdminKey, pAdmRep, pAdmRepDay,
                    pAdmKick, pAdmBan, pAdmWarn, pAdmPrison, pAdmMute,
                    pDataNaz, invite_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    targetName,                // Name
                    parseInt(targetLevel),     // pAdmin
                    'None',                    // pAname
                    targetKey,                 // pAdminKey
                    0,                          // pAdmRep
                    0,                          // pAdmRepDay
                    0,                          // pAdmKick
                    0,                          // pAdmBan
                    0,                          // pAdmWarn
                    0,                          // pAdmPrison
                    0,                          // pAdmMute
                    '-',                        // pDataNaz
                ]
            );
        } else {
            // Update admin existing
            await connection.execute(
                `UPDATE admin SET pAdmin = ?, pAdminKey = ? WHERE Name = ?`,
                [parseInt(targetLevel), targetKey, targetName]
            );
        }

        connection.end();
        return m.reply(`Sukses set admin *${targetName}* ke level *${targetLevel}* dengan AdminKey *${targetKey}*.`);

    } catch (err) {
        console.error(err);
        return m.reply('Gagal set admin.');
    }
}
break;*/


//setadmin pake tabel admin

case 'setadmin': {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');

    const [targetName, targetLevel, adminPassword] = text.split(' ');

    // Validasi input
    if (!targetName || !targetLevel || !adminPassword) {
        return m.reply(`
⚠️ *Format Salah.*

Gunakan:
.setadmin [Nama In Character] [Level 0-8] [Password Admin]

Contoh:
.setadmin Zuarenz_Vazquez 6 pw_admin

📖 *Keterangan Level Admin:*
Level 0 - Bukan Admin
Level 1 - Trial Admin
Level 2 - Helper
Level 3 - Admin I
Level 4 - Admin II
Level 5 - Admin III
Level 6 - High Admin
Level 7 - High Management
Level 8 - Ceo
        `);
    }

    // Validasi level admin (0-7)
    const level = parseInt(targetLevel);
    if (isNaN(level) || level < 0 || level > 8) {
        return m.reply('Level admin harus di antara *0 - 8*.');
    }

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT * FROM admin WHERE Name = ? LIMIT 1',
            [targetName]
        );

        if (rows.length === 0) {
            // Insert admin baru
            await connection.execute(
                `INSERT INTO admin (Name, pAdmin, pAname, pAdminKey) VALUES (?, ?, ?, ?)`,
                [targetName, level, 'None', adminPassword]
            );
        } else {
            // Update admin existing
            await connection.execute(
                `UPDATE admin SET pAdmin = ?, pAdminKey = ? WHERE Name = ?`,
                [level, adminPassword, targetName]
            );
        }

        connection.end();
        return m.reply(`Sukses set admin *${targetName}* ke level *${level}* dengan password *${adminPassword}*.`);

    } catch (err) {
        console.error(err);
        return m.reply('Gagal set admin, ada error pada database.');
    }
}
break;

case 'deladmin': {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');

    const targetName = text.trim();
    if (!targetName) return m.reply(`
⚠️ *Format Salah.*

Gunakan:
.deladmin [Nama In Character]

Contoh:
.deladmin Bayu_Jumantara
    `);

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT * FROM admin WHERE Name = ? LIMIT 1',
            [targetName]
        );

        if (rows.length === 0) {
            connection.end();
            return m.reply(`Player *${targetName}* bukan admin atau tidak ditemukan di database.`);
        }

        await connection.execute(
            'DELETE FROM admin WHERE Name = ?',
            [targetName]
        );

        connection.end();
        return m.reply(`Sukses menghapus admin *${targetName}* dari database.`);
    } catch (err) {
        console.error(err);
        return m.reply('Gagal menghapus admin, ada error pada database.');
    }
}
break;

case 'listadmin': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;

    if (m.chat !== adminGroupId) return reply('Perintah ini hanya bisa digunakan di *grup admin*.');

    try {
        const connection = await connectDb();
        const [results] = await connection.execute(`SELECT Name, pAdmin FROM admin WHERE pAdmin > 0 ORDER BY pAdmin DESC`);
        connection.end();

        if (!results || results.length === 0) {
            return m.reply('📃 Tidak ada admin yang terdaftar.');
        }

        let adminText = `📃 *Daftar Admin Terdaftar:*\n\n`;
        results.forEach((row, index) => {
            let adminLevel = row.pAdmin > 7 ? '👑 Owner' : `📶 Level: ${row.pAdmin}`;
            adminText += `#${index + 1} 👤 *${row.Name}*\n${adminLevel}\n\n`;
        });

        return m.reply(adminText.trim());
    } catch (err) {
        console.error(err);
        return m.reply('⚠️ Terjadi kesalahan saat mengambil daftar admin.');
    }
}
break;

// SET ADMIN MENGGUNAKAN TABEL ACCOUNTS
/*
case 'setadmin': {
    if (!isOwner) return m.reply('❌ Hanya Owner yang bisa pakai perintah ini.');

    const [targetName, targetLevel] = text.split(' ');

    if (!targetName || !targetLevel) {
        return m.reply(`
⚠️ *Format Salah.*

Gunakan:
.setadmin [Nama In Character] [Level 0-8]

Contoh:
.setadmin Zuarenz_Vazquez 6

📖 *Keterangan Level Admin:*
0 - Bukan Admin
1 - Trial Admin
2 - Helper
3 - Admin I
4 - Admin II
5 - Admin III
6 - High Admin
7 - High Management
8 - CEO
        `);
    }

    const level = parseInt(targetLevel);
    if (isNaN(level) || level < 0 || level > 8) {
        return m.reply('❌ Level admin harus antara *0 - 8*.');
    }

    try {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({
            host: global.dbHost,
            user: global.dbUser,
            password: global.dbPass,
            database: global.dbName
        });

        // cek dulu player ada atau tidak
        const [rows] = await conn.execute(
            'SELECT * FROM accounts WHERE Name = ? LIMIT 1',
            [targetName]
        );

        if (rows.length === 0) {
            await conn.end();
            return m.reply(`❌ Player *${targetName}* tidak ditemukan di database.`);
        }

        // update level admin
        await conn.execute(
            'UPDATE accounts SET pAdmin = ? WHERE Name = ?',
            [level, targetName]
        );

        await conn.end();
        return m.reply(`✅ Sukses set *${targetName}* ke level admin *${level}*.`);
    } catch (err) {
        console.error(err);
        return m.reply('❌ Gagal set admin, ada error pada database.');
    }
}
break;


// DELETE ADMIN
case 'deladmin': {
    if (!isOwner) return m.reply('❌ Hanya Owner yang bisa pakai perintah ini.');

    const targetName = text.trim();
    if (!targetName) return m.reply(`
⚠️ *Format Salah.*

Gunakan:
.deladmin [Nama In Character]

Contoh:
.deladmin Bayu_Jumantara
    `);

    try {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({
            host: global.dbHost,
            user: global.dbUser,
            password: global.dbPass,
            database: global.dbName
        });

        const [rows] = await conn.execute(
            'SELECT * FROM accounts WHERE Name = ? LIMIT 1',
            [targetName]
        );

        if (rows.length === 0) {
            await conn.end();
            return m.reply(`❌ Player *${targetName}* tidak ditemukan di database.`);
        }

        await conn.execute(
            'UPDATE accounts SET pAdmin = 0 WHERE Name = ?',
            [targetName]
        );

        await conn.end();
        return m.reply(`✅ Player *${targetName}* berhasil dicabut adminnya.`);
    } catch (err) {
        console.error(err);
        return m.reply('❌ Gagal menghapus admin, ada error pada database.');
    }
}
break;

// LIST ADMIN
case 'listadmin': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;

    if (m.chat !== adminGroupId) return reply('❌ Perintah ini hanya bisa digunakan di *grup admin*.');

    try {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({
            host: global.dbHost,
            user: global.dbUser,
            password: global.dbPass,
            database: global.dbName
        });

        const [results] = await conn.execute(
            'SELECT Name, pAdmin FROM accounts WHERE pAdmin > 0 ORDER BY pAdmin DESC'
        );

        await conn.end();

        if (!results || results.length === 0) {
            return m.reply('📃 Tidak ada admin yang terdaftar.');
        }

        let adminText = `📃 *Daftar Admin Terdaftar:*\n\n`;
        results.forEach((row, index) => {
            let adminLevel = row.pAdmin > 7 ? '👑 Owner' : `📶 Level: ${row.pAdmin}`;
            adminText += `#${index + 1} 👤 *${row.Name}*\n${adminLevel}\n\n`;
        });

        return m.reply(adminText.trim());
    } catch (err) {
        console.error(err);
        return m.reply('⚠️ Terjadi kesalahan saat mengambil daftar admin.');
    }
}
break;*/

case 'setmoney': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;

    if (m.chat !== adminGroupId) return reply('Perintah ini hanya bisa digunakan di *grup admin*.');

    const [playerName, amount] = text.split(' ');

    if (!playerName || !amount || isNaN(amount)) {
        return reply(`Format salah.\n\nGunakan: *${prefix}setmoney [Nama_Karakter] [Jumlah]*\nContoh: *${prefix}setmoney Zuarenz_Montefalco 1000000*`);
    }

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute('SELECT * FROM accounts WHERE pName = ?', [playerName]);

        if (rows.length === 0) {
            connection.end();
            return reply(`Akun *${playerName}* tidak ditemukan di database.`);
        }

        await connection.execute('UPDATE accounts SET pCash = ? WHERE pName = ?', [amount, playerName]);
        connection.end();

        return reply(`Sukses set uang *${playerName}* ke Rp${Number(amount).toLocaleString('id-ID')}.`);
    } catch (err) {
        console.error(err);
        return reply('Gagal set uang.');
    }
}
break;

case 'setlevel': {
    const sftpConfig = JSON.parse(fs.readFileSync('sftp-config.json', 'utf8'));
    const adminGroupId = sftpConfig.admingrup;

    if (m.chat !== adminGroupId) return reply('Perintah ini hanya bisa digunakan di *grup admin*.');

    const [playerName, level] = text.split(' ');

    if (!playerName || !level || isNaN(level)) {
        return reply(`Format salah.\n\nGunakan: *${prefix}setlevel [Nama_Karakter] [Level]*\nContoh: *${prefix}setlevel Bayu_Jumantara 10*`);
    }

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute('SELECT * FROM accounts WHERE pName = ?', [playerName]);

        if (rows.length === 0) {
            connection.end();
            return reply(`Akun *${playerName}* tidak ditemukan di database.`);
        }

        await connection.execute('UPDATE accounts SET pLevel = ? WHERE pName = ?', [level, playerName]);
        connection.end();

        return reply(`Sukses set level *${playerName}* ke *${level}*.`);
    } catch (err) {
        console.error(err);
        return reply('Gagal set level.');
    }
}
break;

case 'backupdb': {
    if (!isOwner) return m.reply('Perintah ini hanya untuk *Owner*!');

    const tanggal = moment.tz('Asia/Jakarta').format('DD-MM-YYYY');
    const jam = moment.tz('Asia/Jakarta').format('HH-mm-ss');
    const folderBackup = path.join(__dirname, 'backups');

    // Cek dan buat folder backup
    if (!fs.existsSync(folderBackup)) {
        fs.mkdirSync(folderBackup);
    }

    const backupFileName = `backup-${tanggal}-${jam}.sql`;
    const backupFilePath = path.join(folderBackup, backupFileName);

    try {
        const connection = await connectDb();
        await connection.end();

        // Jalankan mysqldump
        await execPromise(
            `mysqldump -u${global.usernamedb} -p${global.passworddb} ${global.database} > "${backupFilePath}"`
        );

        console.log(`[BACKUP SUCCESS] File: ${backupFileName}`);
        m.reply(`*Backup database berhasil!*\n📦 File: *${backupFileName}*`);

    } catch (err) {
        console.error('[BACKUP FAILED]', err);

        // Kirim error ke WA owner
        try {
            await sock.sendMessage(`${global.nomorwaowner}@s.whatsapp.net`, {
                text: `*Backup Database Gagal!*\n\n📄 *Error:*\n${err.message || String(err)}`
            });
        } catch (sendErr) {
            console.error('[SEND ERROR TO OWNER FAILED]', sendErr);
        }

        m.reply('Gagal backup database! Error sudah dikirim ke Owner.');
    }
}
break;

case 'setveh': {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');

    if (!text) return reply(`Format salah!\n\nKirim perintah:\n${prefix}setveh [Nama_Player] [ID_Mobil]\nContoh: .setveh Kalz_Toretto 560`);

    const [playerName, vehicleId] = text.split(' ');
    if (!playerName || !vehicleId) {
        return reply(`Format salah!\n\nKirim perintah:\n${prefix}setveh [Nama_Player] [ID_Mobil]\nContoh: .setveh Kalz_Toretto 560`);
    }

    if (vehicleId < 400 || vehicleId > 611) {
        return reply('ID kendaraan harus antara 400 hingga 611.');
    }

    try {
        const connection = await connectDb();
        const [rows] = await connection.execute(
            'SELECT * FROM accounts WHERE pName = ? LIMIT 1',
            [playerName]
        );

        if (rows.length === 0) {
            connection.end();
            return reply(`Player *${playerName}* tidak ditemukan di database.`);
        }

        let akun = rows[0];
        let cModelArray = akun.cModel.split(',');
        let slotKosong = cModelArray.findIndex(v => v == 0);

        if (slotKosong === -1) {
            connection.end();
            return reply(`Player *${playerName}* tidak punya slot kendaraan kosong.`);
        }

        // Update slot dengan kendaraan baru
        cModelArray[slotKosong] = vehicleId;

        // Reset semua data kendaraan di slot ini
        let cColorArray = akun.cColor.split(',');
        let cFuelArray = akun.cFuel.split(',');
        let cHealArray = akun.cHeal.split(',');

        cColorArray[slotKosong] = '0';
        cFuelArray[slotKosong] = '100';
        cHealArray[slotKosong] = '1000';

        await connection.execute(
            `UPDATE accounts SET 
                cModel = ?,
                cColor = ?,
                cFuel = ?,
                cHeal = ?
            WHERE pName = ?`,
            [
                cModelArray.join(','),
                cColorArray.join(','),
                cFuelArray.join(','),
                cHealArray.join(','),
                playerName
            ]
        );

        connection.end();

        reply(`Berhasil set kendaraan!\n\n👤 Player: *${playerName}*\n🚗 Kendaraan: *${vehicleId} (${GetVehicleName(parseInt(vehicleId))})*\n📦 Slot: ${slotKosong + 1}`);
    } catch (err) {
        console.error(err);
        reply('Terjadi kesalahan saat set kendaraan.');
    }
}
break;

case "jid": {
        const info = `*Chat JID:* ${from}\n*Pengirim:* ${sender}`;
        await Dapszz.sendMessage(from, { text: info }, { quoted: m });
        break;
      }
case "ping": {
        const before = Date.now();
        await Dapszz.sendPresenceUpdate("composing", from);
        const after = Date.now();
        await Dapszz.sendMessage(from, { text: `pong! ${after - before}ms` }, { quoted: m });
        break;
      }

case "sendd": {

if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');

let y = text.split(',');
if (y.length < 2) return Reply(`*Format salah!*\nPenggunaan: ${prefix}barang,username`)
let barang = y[0];
let usrr = y[1];
const textb = `📦 ${barang}
> *© 𝐷𝑎𝑛𝑋𝐶𝑙𝑜𝑢𝑑 𝑂𝑓𝑓𝑖𝑐𝑖𝑎𝑙*͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏


sɪʟᴀʜᴋᴀɴ ʟᴏɢɪɴ ᴋᴇ ᴘᴀɴᴇʟ ᴅᴇɴɢᴀɴ ᴜsᴇʀɴᴀᴍᴇ ᴅᴀɴ ᴘᴀssᴏᴡʀᴅ ʏᴀɴɢ ᴀᴅᴀ ᴅɪʙᴀᴡᴀʜ

ᴜsᴇʀɴᴀᴍᴇ : ${usrr}
ᴘᴀssᴡᴏʀᴅ : 011


> ʟɪɴᴋ ʟᴏɢɪɴ ᴘᴀɴᴇʟ : ${domain}

> ʟɪɴᴋ ʟᴏɢɪɴ ᴘʜᴘᴍʏᴀᴅᴍɪɴ : ${phpmyadmin}

*sᴀʟᴜʀᴀɴ :* ${linkSaluran}
*ɢʀᴏᴜᴘ :* ${linkGrup}


*ɴᴏᴛᴇ :*
* *ᴡᴀᴊɪʙ ᴊᴏɪɴ sᴀʟᴜʀᴀɴ & ɢʀᴏᴜᴘ*
* *ᴅɪʟᴀʀᴀɴɢ sᴇʙᴀʀ ʟɪɴᴋ ᴘᴀɴᴇʟ*
* *ᴍᴇᴍʙᴇʟɪ = ᴍᴇɴɢᴇʀᴛɪ*`
await Dapszz.sendMessage(m.chat, {text: textb, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `Hosting DanXCloud ✅`, 
body: `© Powered By ${namaown}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: linkSaluran,
}}}, {quoted: null})
}

    
break
                case'sampwindows': {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');
let t = text.split(',');
if (t.length < 5) return m.reply(`*Contoh :* ${prefix+command} username,nomer,ram,cpu,maxplayer`)
let username = t[0];
let u = m.quoted ? m.quoted.sender : t[1] ? t[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.mentionedJid[0];
let ramlinux = t[2];
let cpulinux = t[3];
let maxplayerlinux = t[4];
let name = username
let egg = "17"
let loc = "1"
let memo = `${ramlinux}`
let cpu = `${cpulinux}`
let disk = `${ramlinux}`
let email = username + "@gmail.xyz"

if (!u) return
let d = (await Dapszz.onWhatsApp(u.split`@`[0]))[0] || {}
let password = d.exists ? crypto.randomBytes(2).toString('hex') : t[3]
let deskripsi = ``
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username,
"first_name": username,
"last_name": username,
"language": "en",
"password": username + password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
let user = data.attributes
let f2 = await fetch(domain + `/api/application/nests/5/eggs/` + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
m.reply(`_Sedang Membuat Server..._`)
await sleep(5000)

let ctf = `\n*Berikut Data Host Anda*


- *ID USER :* ${user.id}
- *USERNAME :* ${user.username}
- *PASSWORD :* ${username + password.toString()}
- *DOMAIN* : ${domain}
- *PHPMYADMIN : ${phpmyadmin}

`

Dapszz.sendMessage(u, { image: { url: peqris}, caption: `${ctf}`}, {quoted: m})

let data2 = await f2.json();
let startup_cmd = data2.attributes.startup

let f3 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": `[WINDOWS] ${name}`,
"description": deskripsi,
"user": user.id,
"egg": parseInt(egg),
"docker_image": "hcgcloud\/pterodactyl-images:ubuntu-wine",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"MAX_PLAYERS": `${maxplayerlinux}`
},
"limits": {
"memory": memo,
"swap": 0,
"disk": disk,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 1,
"backups": 1,
"allocations": 0
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let res = await f3.json()
if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))
let server = res.attributes
let p = await m.reply(`*Server Berhasil Dibuat*

ID User : ${user.id}
ID Server : ${server.id}
Ram : ${ramlinux}
Disk : ${ramlinux}
Cpu ${cpulinux}%


Username dan Password Telah Dikirim
Ke Nomer Tersebut`)

}
                
                break
                case'samplinux': {
    if (!isOwner) return m.reply('Hanya Owner yang bisa pakai perintah ini.');
let t = text.split(',');
if (t.length < 5) return m.reply(`*Contoh :* ${prefix+command} username,nomer,ram,cpu,maxplayer`)
let username = t[0];
let u = m.quoted ? m.quoted.sender : t[1] ? t[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.mentionedJid[0];
let ramlinux = t[2];
let cpulinux = t[3];
let maxplayerlinux = t[4];
let name = `[LINUX] ${username}`
let egg = "16"
let loc = "1"
let memo = `${ramlinux}`
let cpu = `${cpulinux}`
let disk = `${ramlinux}`
let email = username + "@gmail.xyz"

if (!u) return
let d = (await Dapszz.onWhatsApp(u.split`@`[0]))[0] || {}
let password = d.exists ? crypto.randomBytes(2).toString('hex') : t[3]
let deskripsi = ``
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username,
"first_name": username,
"last_name": username,
"language": "en",
"password": username + password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));
let user = data.attributes
let f2 = await fetch(domain + `/api/application/nests/5/eggs/` + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
m.reply(`_Sedang Membuat Server..._`)
await sleep(5000)
let ctf = `\n*Berikut Data Host Anda*


- *ID USER :* ${user.id}
- *USERNAME :* ${user.username}
- *PASSWORD :* ${username + password.toString()}
- *DOMAIN* : ${domain}
- *PHPMYADMIN : ${phpmyadmin}

`

Dapszz.sendMessage(u, { image: { url: peqris}, caption: `${ctf}`}, {quoted: m})

let data2 = await f2.json();
let startup_cmd = data2.attributes.startup

let f3 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": deskripsi,
"user": user.id,
"egg": parseInt(egg),
"docker_image": "ghcr.io\/parkervcp\/games:samp",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"MAX_PLAYERS": `${maxplayerlinux}`
},
"limits": {
"memory": memo,
"swap": 0,
"disk": disk,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 1,
"backups": 1,
"allocations": 0
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let res = await f3.json()
if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))
let server = res.attributes
let p = await m.reply(`*Server Berhasil Dibuat*

ID User : ${user.id}
ID Server : ${server.id}
Ram : ${ramlinux}
Disk : ${ramlinux}
Cpu ${cpulinux}%


Username dan Password Telah Dikirim
Ke Nomer Tersebut`)
}
    
       
default:
}
} catch (err) {
console.log(util.format(err))
}
}

//~~~~~Status Diperbarui~~~~~//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
