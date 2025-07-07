import { createClient } from 'redis';
import { config } from 'dotenv';
config();
const { redis_db_index } = process.env

class Redis {
	async _connect(index) {
		const client = createClient({ database: index ? index : redis_db_index });
		await client.connect();
		return client;
	};

	// ذخیره‌سازی داده‌ها به صورت هَش (استفاده از HSET)
	async c(key, data, ex) {
		if (!key || !data)
			throw new Error('bad input');
		const client = await this._connect();
		await client[
			['string', 'number'].includes(typeof data)
				? 'set' : 'hSet'](`${key}`, data);

		if (ex)
			await client.expire(`${key}`, ex)

		await client.disconnect();
	};

	async create_index(key, data, index) {
		if (!key || !data || !index || isNaN(index))
			throw 'bad input';
		const client = await this._connect(index);
		await client.set(`${key}`, data);
		await client.disconnect();
	};

	async read_index(key, index) {
		if (!key || !index || isNaN(index))
			throw 'bad input';
		const client = await this._connect(index);
		const result = await client.get(`${key}`);
		await client.disconnect();
		return result;
	};

	async delete_index(key, index) {
		const client = await this._connect(index);
		await client.del(`${key}`);
		await client.disconnect();
	};

	async keys_index(index, pattern) {
		if (!index || isNaN(index))
			throw 'bad input';
		const client = await this._connect(index);
		const list = await client.keys(pattern);
		await client.disconnect();
		return list
	}

	// بازیابی یک field خاص از hash (استفاده از HGET)
	async r(key, field) {
		const client = await this._connect();
		if (field)
			return await client.hGet(`${key}`, field)
		const result = await client.hGetAll(`${key}`);
		await client.disconnect();
		return result;
	};

	async g(key) {
		const client = await this._connect();
		const result = await client.get(`${key}`);
		await client.disconnect();
		return result;
	};

	// حذف یک key از Redis
	async d(key) {
		const client = await this._connect();
		await client.del(`${key}`);
		await client.disconnect();
	};
};

export default new Redis();
