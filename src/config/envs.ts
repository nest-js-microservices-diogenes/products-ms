import 'dotenv/config';
import * as Joi from 'joi';

interface EnvsVars {
  PORT: number;
}

const envsSchema = Joi.object({
  PORT: Joi.number().port().required(),
}).unknown(true);

const validationResult = envsSchema.validate(process.env);

if (validationResult.error) {
  throw new Error(`Config validation error: ${validationResult.error.message}`);
}

const envsVars = validationResult.value as EnvsVars;

export const Envs = {
  PORT: envsVars.PORT,
};
