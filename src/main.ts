import { Telegraf } from 'telegraf';
import * as process from 'process';
import { check } from './functions';

const token: string = process.env.TELEGRAM_BOT_TOKEN || '';
if (!token) {
    console.error('No bo token! Exiting...');
    process.exit(1);
}

const bot = new Telegraf(token);

bot.command('check', async ctx => {
    try {
        ctx.reply(await check());
    } catch (e) {
        ctx.reply(`${e.name}: ${e.message}`);
    }
});

bot.launch();
console.log('Bot started!');