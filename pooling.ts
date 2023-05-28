import { Bot } from "grammy"

const bot = new Bot(process.env.BOT_TOKEN as string, {
    client: {
        apiRoot: process.env.TELEGRAM_SERVER || ""
    }
})

bot.on("message:text", ctx => ctx.reply(ctx.message.text))

bot.start()