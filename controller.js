import { v4 } from 'uuid';
import { config } from 'dotenv';
config();
const { user, pass } = process.env;
import { Data } from './models.js'
import { Sequelize } from 'sequelize';

import { create } from './captcha.js';

import { ssn_validator, convert_persian_to_english_numbers } from './helper.js';
export const create_captcha = async (req, res) => {
	try {
		res.json(await create(req.query.id));
	} catch (error) {
		res.status(400).json(error.message || 'خطا')
	};
};

export const add_data = async (req, res) => {
	try {
		const {
			nationalCode,
			name,
			familyname,
			address,
			postalCode,
			phoneNumber,
			houseArea,
			earthquake,
			flood,
			thunderstorm,
			war,
			increaseCapital,
			robbery
		} = req.body;

		// اعتبارسنجی فیلدهای ضروری
		if (!nationalCode || !name || !familyname || !address || !postalCode || !phoneNumber)
			return res.status(400).json('لطفا همه فیلدهای ضروری را وارد کنید.');

		// اعتبارسنجی کد ملی
		if (!ssn_validator(nationalCode))
			return res.status(400).json('کد ملی وارد شده معتبر نیست.');

		// اعتبارسنجی نام و نام خانوادگی
		if (typeof name !== 'string' || name.length < 2)
			return res.status(400).json('نام باید حداقل ۲ حرف باشد.');

		if (typeof familyname !== 'string' || familyname.length < 2)
			return res.status(400).json('نام خانوادگی باید حداقل ۲ حرف باشد.');

		// اعتبارسنجی شماره تلفن
		if (!/^\d{11}$/.test(phoneNumber))
			return res.status(400).json('شماره تلفن باید ۱۱ رقم باشد.');

		// اعتبارسنجی کد پستی
		if (!/^\d{10}$/.test(postalCode))
			return res.status(400).json('کد پستی باید ۱۰ رقم باشد.');

		// اعتبارسنجی متراژ (اختیاری)
		if (houseArea && (isNaN(houseArea) || houseArea <= 0))
			return res.status(400).json('متراژ باید یک عدد مثبت باشد.');

		const data = {
			national_code: nationalCode,
			name,
			family_name: familyname,
			address: convert_persian_to_english_numbers(address),
			postal_code: postalCode,
			phone_number: phoneNumber,
			house_area: houseArea || null,
			earthquake: Boolean(earthquake),
			flood: Boolean(flood),
			stormthunder: Boolean(thunderstorm),
			war: Boolean(war),
			increase_capital: Boolean(increaseCapital),
			robbery: Boolean(robbery)
		};

		const result = await Data.create(data);

		res.status(200).json('اطلاعات با موفقیت ثبت شد.');
	} catch (error) {
		console.error('Database insert error:', error);
		res.status(500).json({ error: 'خطای غیرمنتظره رخ داد.' });
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(401).json('خطا در احراز هویت');

	if (username !== user || password !== pass)
		return res.status(401).json('خطا در احراز هویت.');

	const token = v4();

	await redis.c(token, 1, 4 * 60 * 60);

	res.status(200).json(token);
};

export const get_data = async (req, res) => {
	const { body } = req;

	const where = {};
	
	// Get model attributes
	const model_attributes = Object.keys(Data.getAttributes());

	// Get text fields from model attributes
	const text_fields = model_attributes.filter(attr => {
		const attribute = Data.getAttributes()[attr];
		return attribute.type instanceof Sequelize.STRING || 
			   attribute.type instanceof Sequelize.TEXT ||
			   attribute.type.key === 'STRING' ||
			   attribute.type.key === 'TEXT';
	});

	// Build where clause based on body keys
	Object.keys(body).forEach(key => {
		// Convert camelCase to snake_case for database field names
		const db_field = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
		
		if (model_attributes.includes(db_field) && body[key] !== undefined && body[key] !== null && body[key] !== '') {
			const value = body[key];
			
			// Use LIKE for text fields, exact match for others
			where[db_field] = text_fields.includes(db_field) 
				? { [Sequelize.Op.like]: `%${value}%` }
				: value;
		}
	});

	const data = await Data.findAll({
		where
	});

	res.status(200).json(data);
}