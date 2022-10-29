const User = require('../models/User');
const sharp = require('sharp');

exports.emailAvailable = async (req, res) => {
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(200).send({available: true});
        else return res.status(400).send({available: false});
    } catch (e) {
        res.status(400).send(e.message);
    }
}

exports.signedin = async(req, res) => {
    return res.status(200).send({authenticated: true});
}

exports.register = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(e.message);
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
       
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        res.status(400).send(e.message);
    }
}

exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
}

exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send();
    }
}

exports.me = async (req, res) => {
    res.send(req.user);
}

exports.update = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    if(!isValidUpdate) return res.status(400).send({ error: 'Invalid updates!' });
    try {
        const user = req.user;
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        if(!user) return res.status(404).send();
        res.send(user);
    } catch(e) {
        res.status(400).send(e);
    }
}

exports.delete = async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
}

exports.uploadAvatar = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}

exports.error = (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}

exports.deleteAvatar = async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
}

exports.getAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send();
    }
}