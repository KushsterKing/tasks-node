import express from 'express';
import Joi from 'joi';
import Tasks from '../database/models/tasks.js';

const router = express.Router()

router.post('/', async function (req, res, next) {

    try {

        const schema = Joi.object({
            title: Joi.string().min(4).max(50).required(),
            description: Joi.string().min(4).max(500).required(),
        })

        const result = schema.validate(req.body)

        if(result.error?.details?.[0]?.message){
            return res.status(400).send({error: result.error?.details?.[0]?.message})
        }

        const task = new Tasks({
            ...req.body, user_id: req.user._id
        })

        await task.save()

        return res.status(200).send({data: task, message: 'Task created successfully.'});
    } catch (e) {
        return res.status(400).send({error: e});
    }
})

router.get('/', async function (req, res, next) {
    try {

        const tasks = await Tasks.find({user_id: req.user._id})

        return res.status(200).send({data: tasks, message: 'Tasks fetched successfully.'});
    } catch (e) {
        return res.status(400).send({error: e});
    }
})

router.get('/:id', async function (req, res, next) {
    try {

        const task = await Tasks.findById(req.params.id);

        if(!task) return res.status(404).send({error: 'Task not found'});

        if(req.user._id !== task.user_id) {
            return res.status(400).send({error: `You're not authorized to access this task`});
        }

        return res.status(200).send({data: task, message: 'Task fetched successfully.'});
    } catch (e) {
        return res.status(400).send({error: e});
    }
})

router.delete('/:id', async function (req, res, next) {
    try {

        const task = await Tasks.findOneAndDelete(
            {_id: req.params.id, user_id: req.user._id},)

        return res.status(200).send({data: task, message: 'Task deleted successfully.'});
    } catch (e) {
        return res.status(400).send({error: e});
    }
})

export default router