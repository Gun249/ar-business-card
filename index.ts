import express from 'express';
import cors from 'cors'
const { PrismaClient,Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
const Port : number = 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users/register', async (req, res) => {
    try {
        // 1. รับข้อมูลเข้ามา
        const { username, email, password } = req.body;

        // 2. เพิ่มการตรวจสอบข้อมูลเบื้องต้น
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // 3. ตรวจสอบ username และ email ซ้ำ
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username: username }
        });

        if (existingUserByUsername) {
            return res.status(409).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUserByEmail) {
            return res.status(409).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // 4. เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. สร้างผู้ใช้ใหม่
        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword 
            }
        });

        // 6. ลบรหัสผ่านออกจาก object ก่อนส่งกลับ
        delete newUser.password;

        res.status(201).json(newUser);

    } catch (error : any) {
        // 7. จัดการ Error แบบเจาะจง
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            // P2002 คือรหัสสำหรับ Unique constraint failed
            const target = error.meta?.target;
            if (target?.includes('username')) {
                return res.status(409).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
            } else if (target?.includes('email')) {
                return res.status(409).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
            }
            return res.status(409).json({ error: 'ข้อมูลนี้ถูกใช้งานแล้ว' });
        }

        // Error อื่นๆ ที่ไม่คาดคิด
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const getUsers = await prisma.user.findMany();
        res.status(200).json(getUsers);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
});

app.post('/users/login', async (req, res) => {
    console.log('Login request received:', req.body); // Debug log
    
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ error: 'กรุณากรอก username และ password' });
    }

    try {
        // 1. ค้นหาผู้ใช้จาก username
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        console.log('User found:', user ? 'Yes' : 'No'); // Debug log

        // 2. ตรวจสอบ: ถ้าไม่พบผู้ใช้
        if (!user) {
            return res.status(401).json({ error: 'ไม่พบผู้ใช้งาน' });
        }

        // 3. ตรวจสอบรหัสผ่าน
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch); // Debug log

        if (!passwordMatch) {
            return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // 4. ถ้าทุกอย่างถูกต้อง: ลบ password ออกจาก object
        const userResponse = { ...user };
        delete userResponse.password;

        // 5. ส่งข้อมูลผู้ใช้ (ที่ไม่มีรหัสผ่าน) กลับไป
        console.log('Login successful for user:', username); // Debug log
        return res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user: userResponse
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
    console.log(`Press Ctrl+C to stop the server`);
});
