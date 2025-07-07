import { Sequelize, DataTypes } from 'sequelize';
import { config } from 'dotenv';
config();

const { BIGINT, STRING, FLOAT, BOOLEAN } = DataTypes;
// اتصال به دیتابیس
const { sql_db, sql_user, sql_pass, sql_host, port } = process.env;

const sequelize = new Sequelize(sql_db, sql_user, sql_pass, {
	host: sql_host,
	dialect: 'mssql',
	define: {
		freezeTableName: true,
		timestamps: false
	},
	logging: false,
	dialectOptions: {
		options: {
			requestTimeout: 5 * 60 * 1000
		}
	}
});

// تعریف مدل
export const Data = sequelize.define('kharazmi', {
	id: {
		type: BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	national_code: {
		type: STRING(20),
		allowNull: false
	},
	name: {
		type: STRING(100),
		allowNull: false
	},
	family_name: {
		type: STRING(100),
		allowNull: false
	},
	address: {
		type: STRING(500),
		allowNull: false
	},
	postal_code: {
		type: STRING(20),
		allowNull: false
	},
	phone_number: {
		type: STRING(20),
		allowNull: false
	},
	house_area: {
		type: FLOAT,
		allowNull: true
	},
	earthquake: {
		type: BOOLEAN,
		defaultValue: false
	},
	flood: {
		type: BOOLEAN,
		defaultValue: false
	},
	stormthunder: {
		type: BOOLEAN,
		defaultValue: false
	},
	war: {
		type: BOOLEAN,
		defaultValue: false
	},
	increase_capital: {
		type: BOOLEAN,
		defaultValue: false
	},
	robbery: {
		type: BOOLEAN,
		defaultValue: false
	}
});
