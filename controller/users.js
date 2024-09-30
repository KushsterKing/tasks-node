import express from 'express';
import Joi from 'joi';
import Users from '../database/models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate from "../middlewares/auth.js";

const router = express.Router()

router.post('/register', async function (req, res, next) {

    try {

        const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
        const stringPasswordError = `Password must have 8 to 20 characters with at least a number, a special character, an upper case, a lower case alphabet.`

        const schema = Joi.object({
            name: Joi.string().min(3).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .regex(strongPasswordRegex).messages({'string.pattern.base': stringPasswordError})
                .min(8).max(20).required(),
            confirmPassword: Joi.any().equal(Joi.ref('password'))
                .required()
                .label('Confirm password')
                .options({ messages: { 'any.only': '{{#label}} does not match with password.'} })
        })

        const result = schema.validate(req.body)

        if(result.error?.details?.[0]?.message){
            return res.status(400).send({error: result.error?.details?.[0]?.message})
        }

        const duplicateUser = await Users.findOne({email: req.body.email});

        if (duplicateUser) {
            return res.status(400).send({error: 'User with this email already exists'})
        }

        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, Number(process.env.SALT)),
        })

        await user.save()

        return res.status(200).send({message: 'User registered successfully.'});
    } catch (e) {
        return res.status(400).send({error: e});
    }
})

router.post('/login', async function (req, res, next) {

    try {

        const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
        const stringPasswordError = `Password must have 8 to 20 characters with at least a number, a special character, an upper case, a lower case alphabet.`

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .regex(strongPasswordRegex).messages({'string.pattern.base': stringPasswordError})
                .min(8).max(20).required(),
        })

        const result = schema.validate(req.body)

        if(result.error?.details?.[0]?.message){
            return res.status(400).send({error: result.error?.details?.[0]?.message})
        }

        const user = await Users.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).send({error: `User with this email isn't registered with us.`})
        }

        let passwordMatch = await bcrypt.compare(req.body.password, user.password)

        if(!passwordMatch){
            return res.status(400).send({error: `Password you've entered is wrong.`})
        }

        let userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }

        let token = jwt.sign(userInfo, process.env.JWT_SECRET);

        return res.status(200).send({user: userInfo, token});
    } catch (e) {

        console.log(e);
        return res.status(400).send({error: e});
    }

})

// router.post('/verify', authenticate, async function (req, res, next) {
//     if(req.user?._id){
//         return res.status(200).send({user: userInfo, token});
//     }
// })

export default router