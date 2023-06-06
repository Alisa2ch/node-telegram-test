import { Bot, webhookCallback } from 'grammy';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_TOKEN as string, {
	client: {
		apiRoot: process.env.TELEGRAM_SERVER || ''
	}
});

bot.command('start', async (ctx) => {
	console.log(ctx.hasOwnProperty('from'), ctx.from != null, ctx?.from?.hasOwnProperty('id'))
	if(ctx.hasOwnProperty('from') && ctx.from != null && ctx.from.hasOwnProperty('id')){

		const user = await prisma.user.create({
			data: {
				id: ctx.from.id,
				date_create: Date.now(),
				type: 'basic',
				language: 'en',
				type_date: 'ddmmyyyy',
			}
		})

	console.log(user);
	}

	await ctx.reply("welcome");
})

// bot.on('message:photo', async ctx => {
// 	// console.log(ctx);
// 	const userLang = await prisma.user.findUnique({
// 		where: {
// 			id: ctx.from?.id
// 		}
// 	})
// 	await ctx.reply(JSON.stringify(userLang?.language));
// })

const server = express();
server.use(express.json());

server.post('/webhook', webhookCallback(bot, 'express'));

server.listen(process.env.TELEGRAM_WEBHOOK_PORT);

bot.api.setWebhook(process.env.TELEGRAM_WEBHOOK_SERVER as string);
