"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const grammy_1 = require("grammy");
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const storage_mongodb_1 = require("@grammyjs/storage-mongodb");
// Create an instance of the `Bot` class and pass your bot token to it.
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb://admin:admin@127.0.0.1:27018/admin");
    const collection = mongoose_1.default.connection.db.collection("sessions");
    const bot = new grammy_1.Bot("6477759041:AAGkQZsVjt9oRt4K3qhaUL7BXFJn30Dap98"); // <-- put your bot token between the ""
    bot.use((0, grammy_1.session)({
        // initial: (): SessionData => ({
        //     pizzaCount: 0,
        // }),
        storage: new storage_mongodb_1.MongoDBAdapter({ collection }),
    }));
    // You can now register listeners on your bot object `bot`.
    // grammY will call the listeners when users send messages to your bot.
    // Handle the /start command.
    bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        ctx.session.addres = yield axios_1.default.get('http://127.0.0.1:3000/wallet/newAddres');
        ctx.reply(ctx.session.addres);
    }));
    //
    bot.command("getAddres", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
    }));
    //
    bot.command("getBalance", (ctx) => ctx.reply("12312312"));
    bot.command("newPay", (ctx) => ctx.reply("12312312"));
    // Handle other messages.
    bot.on("message", (ctx) => ctx.reply("Got another message!"));
    // Now that you specified how to handle messages, you can start your bot.
    // This will connect to the Telegram servers and wait for messages.
    // Start the bot.
    bot.start();
}))();
