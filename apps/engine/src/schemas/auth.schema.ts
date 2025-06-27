import type { IRegistration, ILogin } from "@src/types";
import Joi, { type ObjectSchema } from "joi";

export const registrationSchema: ObjectSchema<IRegistration> = Joi.object({
	username: Joi.string()
		.pattern(/^[a-zA-Z0-9 ]+$/)
		.min(1)
		.max(50)
		.required()
		.messages({
			"string.base": "username should be a string",
			"string.empty": "username should not be empty",
			"string.pattern.base": "username should only contain alphanumeric characters and spaces",
			"string.min": "username length must be at least {#limit} characters",
			"string.max": "username length must be at most {#limit} characters",
			"any.required": "username is required",
		}),

	email: Joi.string()
		.email({ tlds: { allow: true } })
		.lowercase()
		.min(5)
		.max(100)
		.required()
		.messages({
			"string.base": "email should be a valid email address",
			"string.empty": "email should not be empty",
			"string.email": "email should be a valid email address",
			"string.min": "email length must be at least {#limit} characters",
			"string.max": "email length must be at most {#limit} characters",
			"any.required": "email is required",
		}),

	password: Joi.string().min(4).max(20).required().messages({
		"string.base": "password should be a string",
		"string.empty": "password should not be empty",
		"string.min": "password length must be at least {#limit} characters",
		"string.max": "password length must be at most {#limit} characters",
		"any.required": "password is required",
	}),
});

export const loginSchema: ObjectSchema<ILogin> = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: true } })
		.lowercase()
		.min(5)
		.max(100)
		.required()
		.messages({
			"string.base": "email should be a valid email address",
			"string.empty": "email should not be empty",
			"string.email": "email should be a valid email address",
			"string.min": "email length must be at least {#limit} characters",
			"string.max": "email length must be at most {#limit} characters",
			"any.required": "email is required",
		}),

	password: Joi.string().min(4).max(20).required().messages({
		"string.base": "password should be a string",
		"string.empty": "password should not be empty",
		"string.min": "password length must be at least {#limit} characters",
		"string.max": "password length must be at most {#limit} characters",
		"any.required": "password is required",
	}),
});
