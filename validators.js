const Joi = require("joi");

module.exports = {
    validateRequest: (body) => {

        const schema = Joi.object({
            lat: Joi.number()
                .required(),

            long: Joi.number()
                .required(),
            site_id: Joi.string()
                .required()
                .trim()
                .max(255),
            site_name: Joi.string()
                .required()
                .trim()
                .max(255),
            site_status: Joi.string()
                .required()
                .trim()
                .valid("online","offline"),
        });

        return schema.validate(body)


    },


    validateDeleteRequest: (body) => {

        const schema = Joi.object({
            site_id: Joi.string()
                .required()
                .trim()
                .max(255),
        });

        return schema.validate(body)


    }


}

