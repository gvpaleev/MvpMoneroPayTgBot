import 'dotenv/config'
import { Bot, session } from "grammy";
import axios from 'axios';
import mongoose from "mongoose";
import { MongoDBAdapter, ISession } from "@grammyjs/storage-mongodb";



// Create an instance of the `Bot` class and pass your bot token to it.
(async()=>{

    await mongoose.connect("mongodb://admin:admin@127.0.0.1:27018/admin");
    const collection = mongoose.connection.db.collection<ISession>(
        "sessions",
      );

    
    const bot = new Bot("6477759041:AAGkQZsVjt9oRt4K3qhaUL7BXFJn30Dap98"); // <-- put your bot token between the ""

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
        let address = (await axios.get('http://127.0.0.1:3000/wallet/newAddres')).data.address;
        let indexAaddress = (await axios.get('http://127.0.0.1:3000/wallet/newAddres')).data.index;

        ctx.session.address=address;
        ctx.session.indexAaddress=indexAaddress;

        ctx.reply("ctx.session.address");

    });
    //
    bot.command("getAddres", async (ctx) => {

        ctx.reply(ctx.session.address)
        // axios.get('http://127.0.0.1:3000/wallet/newAddres')
        // .then(function (response) {
        //     // handle success
        //     ctx.reply(response.data.address);
        // })
        // .catch(function (error) {
        //     // handle error
        //     console.log(error);
        // });
        // ctx.reply("await axios.get('http://127.0.0.1:3000/wallet/newAddres')");
    });
    //

    bot.command("getBalance", (ctx) => ctx.reply("12312312"));

    bot.command("newPay", (ctx) => ctx.reply("12312312"));



    // Handle other messages.
    bot.on("message", (ctx) => ctx.reply("Got another message!"));

    // Now that you specified how to handle messages, you can start your bot.
    // This will connect to the Telegram servers and wait for messages.

    // Start the bot.
    bot.start();

})()