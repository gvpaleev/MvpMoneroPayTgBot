import 'dotenv/config'
import { Bot, Context, session } from "grammy";
import axios from 'axios';
import mongoose from "mongoose";
import { MongoDBAdapter, ISession } from "@grammyjs/storage-mongodb";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import { exec } from "https://deno.land/x/exec/mod.ts"
import { OutputMode } from "https://deno.land/x/exec@0.0.5/mod.ts";


// let a = sh('zbarimg photo.jpg')

// var qr = qrcodeParser();
// var yourscript = exec('sh echo "ads"',
//         (error, stdout, stderr) => {
//             console.log(stdout);
//             console.log(stderr);
//             if (error !== null) {
//                 console.log(`exec error: ${error}`);
//             }
//         })

// var qr = new QrcodeDecoder();
// Create an instance of the `Bot` class and pass your bot token to it.
(async()=>{

    await mongoose.connect("mongodb://admin:admin@127.0.0.1:27018/admin");
    const collection = mongoose.connection.db.collection<ISession>(
        "sessions",
      );

    type MyContext = FileFlavor<Context>;
    const bot = new Bot<MyContext>("6477759041:AAGkQZsVjt9oRt4K3qhaUL7BXFJn30Dap98"); // <-- put your bot token between the ""
    bot.api.config.use(hydrateFiles(bot.token));
    bot.use(session({
        // initial: (): SessionData => ({
        //     pizzaCount: 0,
        // }),
        storage: new MongoDBAdapter({ collection }),
    }))
    // You can now register listeners on your bot object `bot`.
    // grammY will call the listeners when users send messages to your bot.

    // Handle the /start command.
    bot.command("start", async (ctx) => {
        if(!ctx.session.address){
            let address = (await axios.get('http://127.0.0.1:3000/wallet/newAddres')).data.address;
            let indexAaddress = (await axios.get('http://127.0.0.1:3000/wallet/newAddres')).data.index;

            ctx.session.address=address;
            ctx.session.indexAaddress=indexAaddress;
        }
        
        ctx.reply("Wellcom");

    });
    //
    bot.command("getAddres", async (ctx) => {
        ctx.reply(ctx.session.address);
    });
    //

    bot.command("getBalance", async (ctx) => {
        console.log('getBalance');
        let balance = (await axios.get('http://127.0.0.1:3000/wallet/getBalance',{
            params:{
                "index":ctx.session.indexAaddress
            }
        })).data;
        console.log(balance);
        ctx.reply(balance);
    });

    bot.command("newPay", async (ctx) => ctx.reply("отрпавь фото"));

    bot.on(':photo',async (ctx)=>{
        let {id} = ctx.from;
        let pathPhoto = `./bufferQrCodes/${id}.png`;

        let file = await ctx.getFile();
        await file.download(pathPhoto);

        let returZbarimg = await exec(`zbarimg bufferQrCodes/300774281.png`, {output: OutputMode.Capture});

        if(returZbarimg.status.code != 0){
            ctx.reply('Qr не распознан');
            return;
        }

        ctx.reply(returZbarimg.output)
    })

    // Handle other messages.
    bot.on("message", async (ctx) => {
        
        let a = await exec('zbarimg photo2.jpg', {output: OutputMode.Capture});
        console.log(a);
        ctx.reply('a')

        // qrcodeParser('./photo.png');
        
    });

    // Now that you specified how to handle messages, you can start your bot.
    // This will connect to the Telegram servers and wait for messages.

    // Start the bot.
    bot.start();

})()