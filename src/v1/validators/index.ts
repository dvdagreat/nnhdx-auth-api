import Joi from "joi";

async function validateLogin(data: object): Promise<object> {
    const schema = Joi.object({
        username: Joi.string().required().alphanum().min(6).max(18),
        password: Joi.string().required().min(6).max(20),
    });

    return await schema.validateAsync(data) as object
}

async function validateRegister(data: object): Promise<object> {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(6).max(18),
        email: Joi.string().email().min(3),
        password: Joi.string().min(6).max(20),
    });

    return await schema.validateAsync(data) as object
}

export { validateLogin, validateRegister };
