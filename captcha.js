import svgCaptcha from 'svg-captcha';
import redis from './redis.js';
import { v4 } from 'uuid';
import { checkid } from './helper.js';
import { config } from 'dotenv';
config();

const expire = 2 * 60;
export const create = async (id) => {
	var { data: captcha, text } = svgCaptcha.create({
		size: 5,
		ignoreChars: '0o1il',
		noise: Math.round(Math.random() * 4),
	});

	if (id) {
		checkid(id)
		await redis.d(id);
	};

	id = v4();
	await redis.c(id, text, expire);
	return { id, captcha, expire };
};

export const check = async (text, id) => {
	checkid(id);

	let t = await redis.g(id);
	if (!t)
		throw new Error('کد امنیتی منقضی شده');

	await redis.d(id);
	if (text.toUpperCase() != t.toUpperCase())
		throw new Error('کد امنیتی صحیح نیست');
};