const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } =  require('express-validator');

const User = require('../models/user');

exports.user_create_get = (req, res, next) => {
    res.render('sign-up-form', { title: 'Sign Up'});
}

exports.user_create_post = [
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified'),
    body('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified'),
    body('username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Username must be specified')
        .custom(async (value) => {
            const existingUser = await User.findOne({ username: value }).exec();
            console.log(existingUser)
            if(existingUser) {
                throw new Error('The username you entered is already in use')
            }
        }),
    body('password')
        .isLength({ min: 8 })
        .escape()
        .withMessage('Password must contain at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
        .escape()
        .withMessage('Password must contain at least one upper case letter, at least one lower case letter, and at least one special character'),
    body('confirm_password')
        .custom((value, {req}) => value === req.body.password)
        .withMessage('Passwords must match'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // There are errors, re-render
            res.render('sign-up-form' ,{
                title: 'Sign Up',
                firstNameAttempt: req.body.first_name,
                lastNameAttempt: req.body.last_name,
                userNameAttempt: req.body.username,
                errors: errors.array()
            });
            return;
        } else {
            // No errors. Create user with encrypted password and save to database
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hashedPassword,
                member: false,
                admin: false
            });

            await user.save();
            res.redirect('/');
        }
    })
];

exports.user_login_get = (req, res, next) => {
    res.render('log-in-form', {
        title: 'Log In'
    });
};