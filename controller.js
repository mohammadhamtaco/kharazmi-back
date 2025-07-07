import { Data } from './models.js'

import { create, check } from './captcha.js';

export const create_captcha = async (req, res) => {
	try {
		res.json(await create(req.query.id));
	} catch (error) {
		res.status(400).json(error.message || 'خطا')
	};
};

export const check_captcha = async (req, res, next) => {
	try {
		const { id, text } = req.body;
		await check(text, id);
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

		// بررسی اولیه مقادیر ضروری
		if (!nationalCode || !name || !familyname || !address || !postalCode || !phoneNumber)
			return res.status(400).json({ error: 'Missing required fields' });


		const data = {
			national_code: nationalCode,
			name,
			family_name: familyname,
			address,
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

		res.status(200).json({ message: 'Data inserted successfully', result });
	} catch (error) {
		console.error('Database insert error:', error);
		res.status(500).json({ error: 'An unexpected error occurred.' });
	}
}