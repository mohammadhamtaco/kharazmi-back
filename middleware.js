import redis from "./redis.js";
import { check } from "./captcha.js";
export const check_json = (req, res, next) => {
	if (req.method.toLowerCase() === 'get')
		next();
	
	try {
		let { body } = req;
		body = JSON.parse(body);
		next();
	} catch (error) {
		res.status(400).json('خطا در ارسال داده');
	}
}

export const check_auth = async (req, res, next) => {
	const { token } = req.headers;
	if (!token)
		return res.status(401).json('خطا در احراز هویت');

	const t = await redis.g(token);
	if (!t)
		return res.status(401).json('خطا در احراز هویت');

	next();
};

export const check_captcha = async (req, res, next) => {
	try {
		const { captcha, id } = req.body;
		await check(captcha, id);
		next();
	} catch (error) {
		console.log(error)
		res.status(400).json(error.message || 'خطا')
	}
};
