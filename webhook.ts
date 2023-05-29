import { Bot, webhookCallback } from 'grammy'
import express from 'express'

const bot = new Bot(process.env.TELEGRAM_TOKEN as string, {
	client: {
		   apiRoot: process.env.TELEGRAM_SERVER || ''
		}
	})

bot.on('message:text', ctx => {
	console.log(ctx);
	ctx.reply(ctx.message.text);
})

const server = express()
server.use(express.json())

server.post('/webhook', webhookCallback(bot, 'express'))

server.listen(process.env.TELEGRAM_WEBHOOK_PORT)

bot.api.setWebhook(process.env.TELEGRAM_WEBHOOK_SERVER as string)

console.log([
	process.env.TELEGRAM_TOKEN,
	process.env.TELEGRAM_SERVER,
	process.env.TELEGRAM_WEBHOOK_PORT,
	process.env.TELEGRAM_WEBHOOK_SERVER
])
