import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs'

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing email or password." }, { status: 400 });
        }

        await connectMongoDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        return NextResponse.json({ message: "User registered." }, { status: 201 });
    } catch(error) {
        console.error("Registration error: ", error);
        return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
    }
}
