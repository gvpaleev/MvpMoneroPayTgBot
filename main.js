const { Bot, InputFile, InputMediaBuilder } = require("grammy");
const { hydrate, HydrateFlavor } = require("@grammyjs/hydrate");
const fs = require("fs");
const { default: axios } = require("axios");
const { exec } = require("child_process");
const fsPromises = fs.promises;

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot("6477759041:AAGkQZsVjt9oRt4K3qhaUL7BXFJn30Dap98"); // <-- put your bot token between the ""
bot.use(hydrate());
//replyWithAutoDelete
bot.use(async (ctx, next) => {
  ctx.replyWithAutoDelete = async (msg, config = {}, secForDelete = 20) => {
    let footerMsg = `Auto-delete: ${secForDelete}`;

    ctx.reply(`${msg}\n\n${footerMsg}`).then(async (statusMessage) => {
      for (let i = secForDelete - 1; i > 0; i--) {
        let footerMsg = `Auto-delete: ${i}`;

        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        await statusMessage.editText(`${msg}\n\n${footerMsg}`);
      }
      statusMessage.delete();
    });
  };
  // Run remaining handlers.
  await next();
});
//replyWithPhotoAutoDelete
bot.use(async (ctx, next) => {
  ctx.replyWithPhotoAutoDelete = async (
    pathPhoto,
    caption,
    secForDelete = 20
  ) => {
    let footerMsg = (await getMessangeAutoDelete()).replace(
      "seconds",
      secForDelete
    );
    let file = new InputFile(pathPhoto);
    // const newMedia = InputMediaBuilder.photo(
    //   "/github/mvp-monero-pay-tg-bot/photo2.jpg"
    // );

    // const photo = InputMediaBuilder.photo(pathPhoto, {
    //   caption: "grammY is awesome",
    //   // etc
    // });
    // await ctx.replyWithMediaGroup([photo]);
    ctx
      .replyWithPhoto(file, {
        caption: caption + footerMsg,
        parse_mode: "HTML",
      })
      .then(async (statusMessage) => {
        for (let i = secForDelete - 1; i > 0; i-=2) {
          let footerMsg = (await getMessangeAutoDelete()).replace("seconds", i);

          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          await statusMessage.editCaption(caption + footerMsg, {
            parse_mode: "HTML",
          });
        }
        statusMessage.delete();
      });

    // ctx.reply(`${msg}\n\n${footerMsg}`).then(async (statusMessage) => {
    //   for (let i = secForDelete - 1; i > 0; i--) {
    //     let footerMsg = `Auto-delete: ${i}`;

    //     await new Promise((resolve) => {
    //       setTimeout(resolve, 1000);
    //     });
    //     await statusMessage.editText(`${msg}\n\n${footerMsg}`);
    //   }
    //   statusMessage.delete();
    // });
  };

  // Run remaining handlers.
  await next();
});

// Handle the /start command.
bot.command("start", async (ctx) => {
  await ctx.reply(await getMessangeWelcome(), {
    parse_mode: "HTML",
  });
  await ctx.deleteMessage();
});
// Handle other messages.

bot.command("topUpBalance",async (ctx)=>{

  let addressForReplenishment= (await axios.post("http://127.0.0.1:3002/getAddressForReplenishment", {

    uid: ctx.from.id,
    moneroAccountIndex:0

    
  })).data.addressForReplenishment.address;
  
  let pathQrForReplenishment=`bufferImage/${addressForReplenishment}_ForReplenishment.png`;

  let message = (await getMessangeTopUpBalance())
  .replace('address',addressForReplenishment);
  


  await exec(`qrencode -o ${pathQrForReplenishment} '${addressForReplenishment}'`);
  await ctx.replyWithPhotoAutoDelete(
    pathQrForReplenishment,
    message
  )
  // await exec(`rm -rf ${pathQrForReplenishment}`);

})

bot.command("getBalance",async (ctx)=>{
  let   balance = (await axios.post("http://127.0.0.1:3002/getBalance", {

    uid: ctx.from.id
    
  })).data;

  
  ctx.  replyWithAutoDelete(balance);

})
bot.on("message", async (ctx) => {
  //   ctx.replyWithAutoDelete("sadasd");
  let pathPhoto = "/github/mvp-monero-pay-tg-bot/photo.png";
  let caption =
    '<b>Hi!</b> <i>Welcome</i> to <a href="https://grammy.dev">grammY</a>.';
  ctx.replyWithPhotoAutoDelete(pathPhoto, caption,secForDelete =60);
  //   await ctx.replyWithPhoto(a, {
  //     caption:
  //       '<b>Hi!</b> <i>Welcome</i> to <a href="https://grammy.dev">grammY</a>.',
  //     parse_mode: "HTML",
  //   });
  // await ctx.api.sendPhoto(
  //   ctx.from.id,
  //   new InputFile("/github/mvp-monero-pay-tg-bot/photo.png"),
  //   {
  //     caption: "photo.jpg",
  //   }
  // );
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();

async function getMessangeAutoDelete() {
  return `\n\n${(
    await fsPromises.readFile("./messange/auto-delete.html")
  ).toString()}`;
}
async function getMessangeWelcome() {
  return `${(await fsPromises.readFile("./messange/welcome.html")).toString()}`;
}
async function getMessangeTopUpBalance() {
  return `${(await fsPromises.readFile("./messange/top-up-balance.html")).toString()}`;
}
