const fs = require('node:fs');
const path = require('node:path');
const yargs = require('yargs');

//Cek User Input Flag
const argv = yargs
    .usage('Cara menggunakan CLI')
    .demandCommand(1, 'Masukan filepath')
    .option('t', {
        alias: 'type',
        choices: ['text', 'json'],
        describe: 'Memilih output type',
        default: 'text'
    })
    .option('o', {
        alias: 'output',
        describe: 'Memilih lokasi direktori penyimpanan output file.'
    })
    .help('h')
    .alias('h', 'Bantuan')
    .argv;

//Membuat Variabel & assign dengan variabel argv
const logFile = argv._[0];
const outputType = argv.type;
const outputFile = argv.output;

fs.readFile(logFile, 'utf-8', (err, data) => {
    if (err) {
        console.error(`Gagal membaca log file ${logFile}`);
        process.exit(1);
    }

    let outputData;

    //Cek opsi jika user memberikan perintah json
    if (outputType === 'json') {
        try {
            outputData = data.trim().split('\n').map(line => JSON.parse(line));          
        } catch (error) {
            console.error(`Gagal convert ${logFile} ke json`);
            process.exit(1);
        }
    }else{
        outputData = data;
    }

    if (outputFile) {
        const outputDir = path.dirname(outputFile);
        //Cek Diretori    
        if (!fs.existsSync(outputDir)) {
            console.error(`Direktory ${outputDir} tidak ditemukan.`);
            process.exit(1);
        }

        fs.writeFile(outputFile, outputData, (err) => {
            if (err) {
                console.error(`Gagal menulis data output ${outputFile}`);
                process.exit(1);
            }

            console.log(`Log file telah tersimpan di  ${outputFile}`);
        });
    }else{
        console.log(outputData);
    }
})