export const checkid = id => {
	if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/.test(`${id}`.toUpperCase()))
		throw new Error('خطا در کنترل پارامتر ورودی');
};

export const ssn_validator = ssn => {
	var i;
	if (!/^\d{10}$/.test(ssn) || ssn == '0000000000' || ssn == '1111111111' || ssn == '2222222222' || ssn == '3333333333' || ssn == '4444444444' || ssn == '5555555555' || ssn == '6666666666' || ssn == '7777777777' || ssn == '8888888888' || ssn == '9999999999')
		return false;
	var check = parseInt(ssn[9]);
	var sum = 0;
	for (i = 0; i < 9; ++i)
		sum += parseInt(ssn[i]) * (10 - i);
	sum %= 11;
	return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
};

export const test_date = (date) => {
	if (!date || typeof date !== 'string')
		throw new Error('تاریخ صحیح نیست');

	if (!/^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/.test(date))
		throw new Error('تاریخ صحیح نیست');
	return true
};

export const convert_persian_to_english_numbers = (text) => {
	if (!text || typeof text !== 'string') return text;
	
	const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
	const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
	const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	
	let result = text;
	
	// تبدیل اعداد فارسی
	persianNumbers.forEach((num, index) => {
		result = result.replace(new RegExp(num, 'g'), englishNumbers[index]);
	});
	
	// تبدیل اعداد عربی
	arabicNumbers.forEach((num, index) => {
		result = result.replace(new RegExp(num, 'g'), englishNumbers[index]);
	});
	
	return result;
};