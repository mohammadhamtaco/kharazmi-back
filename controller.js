import { Data } from './models.js'

import { create, check } from './captcha.js';

import { ssn_validator, convert_persian_to_english_numbers } from './helper.js';
export const create_captcha = async (req, res) => {
	try {
		res.json(await create(req.query.id));
	} catch (error) {
		res.status(400).json(error.message || 'خطا')
	};
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

		res.status(200).json('اطلاعات با موفقیت ثبت شد.' );
	} catch (error) {
		console.error('Database insert error:', error);
		res.status(500).json({ error: 'خطای غیرمنتظره رخ داد.' });
	}
}