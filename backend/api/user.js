const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authSecret } = require('../.env');

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ errors: ['Incomplete data'] });
        }

        try {
            const user = await app.db('users')
                .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
                .first();

            if (user) {
                const isMatch = await bcrypt.compare(req.body.password, user.password);

                if (!isMatch) {
                    return res.status(401).json({ errors: ['Invalid email or password!'] });
                }

                const payload = { id: user.id };
                const token = jwt.sign(payload, authSecret, { expiresIn: '1h' });  // JWT token с 1 часом действия

                return res.json({
                    name: user.name,
                    email: user.email,
                    token
                });
            } else {
                return res.status(400).json({ errors: ['User not registered!'] });
            }
        } catch (err) {
            return res.status(500).json({ errors: ['Internal server error', err.message] });
        }
    };

    const validateToken = (req, res) => {
        const token = req.body.token || '';

        jwt.verify(token, authSecret, function (err) {
            return res.status(200).send({ valid: !err });
        });
    };

    const obterHash = async (password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (err) {
            throw new Error('Error generating hash');
        }
    };

    const save = async (req, res) => {
        try {
            const { password, confirm_password, name, email } = req.body;
    
            if (password !== confirm_password) {
                return res.status(400).json({ errors: ['Passwords do not match.'] });
            }
    
            // Проверка, существует ли уже пользователь с таким email
            const existingUser = await app.db('users')
                .whereRaw("LOWER(email) = LOWER(?)", email)
                .first();
    
            if (existingUser) {
                return res.status(400).json({ errors: ['Email is already in use.'] });
            }
    
            // Хешируем пароль
            const hashedPassword = await obterHash(password);
    
            // Вставка нового пользователя
            await app.db('users')
                .insert({
                    name,
                    email,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date()  // Устанавливаем текущее время для updated_at
                })
                .returning('id');
    
            // После успешной регистрации сразу пытаемся выполнить вход
            return signin(req, res);
        } catch (err) {
            return res.status(400).json({ errors: ['Error saving user:', err.message] });
        }
    };

    const get = async (req, res) => {
        try {
            const users = await app.db.select(
                { id: 'users.id', name: 'users.name', email: 'users.email' }
            ).from('users');

            return res.json(users);
        } catch (err) {
            return res.status(500).json({ errors: ['Error fetching users:', err.message] });
        }
    };

    return { signin, validateToken, save, get };
};
