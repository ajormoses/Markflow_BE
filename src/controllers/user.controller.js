import { BadRequestError, NotFoundError } from "../errors/index"
import { User } from "../models/user.model";
import jwt from 'jsonwebtoken'


const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the fields are not empty
    if (!username || !email || !password) {
        throw new BadRequestError("All fields are required");
    }

    // check if user already exists
    const existingUser = await User.findOne({email: email.toLowerCase()})

    if(existingUser) {
        throw new BadRequestError('user already exists')
    }

    // create a new user
    const user = await User.create({
        username,
        password,
        email: email.toLowerCase(),
        loggedIn: false
    })

    res.status(201).json({ message: 'user registered successfully', user})
}


const loginUser = async (req, res) => {
    const { email, password} = req.body;

    const user = await User.findOne({email: email.toLowerCase()})

    if (!user || !(await user.comparePassword(password))) {
        throw new BadRequestError("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


const logout = async (req, res) => {
    req.session = null
    res.status(200).send({message: 'you have successfullyn signed out'})
}

const currentUser = async(req, res) => {
    res.status(200).send({currentUser: req.currentUser || null})
}



export { loginUser, registerUser, logout, currentUser };