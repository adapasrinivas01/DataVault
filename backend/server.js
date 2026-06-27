const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("../database/database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS dashboard_info(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER UNIQUE,

    fullName TEXT,
    dob TEXT,
    bloodGroup TEXT,
    permanentAddress TEXT,
    pinCode TEXT,

    aadhaarNumber TEXT,
    panNumber TEXT,
    bankAccountNumber TEXT,
    voterIdNumber TEXT,
    drivingLicenceNumber TEXT,

    FOREIGN KEY(user_id) REFERENCES users(id)

)
`);

app.post("/signup", async (req,res)=>{

    const {name,email,password} = req.body;

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err,user)=>{

            if(user){

                return res.status(400).json({
                    message:"User already exists"
                });
            }

            const hashedPassword =
            await bcrypt.hash(password,10);

            db.run(
                `INSERT INTO users
                (name,email,password)
                VALUES(?,?,?)`,
                [name,email,hashedPassword],

                function(err){

                    if(err){

                        return res.status(500).json({
                            message:"Database Error"
                        });
                    }

                    res.status(201).json({
                        message:"Signup Successful"
                    });
                }
            );
        }
    );
});

app.post("/login", (req,res)=>{

    const {email,password} = req.body;

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err,user)=>{

            if(!user){

                return res.status(401).json({
                    message:"Invalid Email"
                });
            }

            const match =
            await bcrypt.compare(
                password,
                user.password
            );

            if(!match){

                return res.status(401).json({
                    message:"Invalid Password"
                });
            }

            res.json({
                message: "Login Successful",
                userId: user.id,
                name: user.name,
                email: user.email
            });
        }
    );
});

app.post("/dashboard", (req, res) => {

    const {

        userId,
        fullName,
        dob,
        bloodGroup,
        permanentAddress,
        pinCode,
        aadhaarNumber,
        panNumber,
        bankAccountNumber,
        voterIdNumber,
        drivingLicenceNumber

    } = req.body;

    db.get(

        "SELECT * FROM dashboard_info WHERE user_id=?",

        [userId],

        (err, row) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (row) {

    db.run(

        `UPDATE dashboard_info SET

        fullName=?,
        dob=?,
        bloodGroup=?,
        permanentAddress=?,
        pinCode=?,
        aadhaarNumber=?,
        panNumber=?,
        bankAccountNumber=?,
        voterIdNumber=?,
        drivingLicenceNumber=?

        WHERE user_id=?`,

        [

            fullName,
            dob,
            bloodGroup,
            permanentAddress,
            pinCode,
            aadhaarNumber,
            panNumber,
            bankAccountNumber,
            voterIdNumber,
            drivingLicenceNumber,
            userId

        ],

        function(err){

            if(err){

                return res.status(500).json({
                    message:"Database Error"
                });

            }

            return res.json({
                message:"Dashboard Data Saved"
            });

        }

    );

    return;

}

            db.run(

                `INSERT INTO dashboard_info
                (
                    user_id,
                    fullName,
                    dob,
                    bloodGroup,
                    permanentAddress,
                    pinCode,
                    aadhaarNumber,
                    panNumber,
                    bankAccountNumber,
                    voterIdNumber,
                    drivingLicenceNumber
                )

                VALUES(?,?,?,?,?,?,?,?,?,?,?)`,

                [

                    userId,
                    fullName,
                    dob,
                    bloodGroup,
                    permanentAddress,
                    pinCode,
                    aadhaarNumber,
                    panNumber,
                    bankAccountNumber,
                    voterIdNumber,
                    drivingLicenceNumber

                ],

                function(err){

                    if(err){

                        return res.status(500).json({
                            message:"Failed to Save Data"
                        });

                    }

                    res.json({
                        message:"Dashboard Data Saved Successfully"
                    });

                }

            );

        }

    );

});
/* ===============================
   GET DASHBOARD DATA
================================ */

app.get("/dashboard/:userId", (req, res) => {

    const userId = req.params.userId;

    db.get(
        "SELECT * FROM dashboard_info WHERE user_id = ?",
        [userId],
        (err, row) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (!row) {

                return res.status(404).json({
                    message: "No Data Found"
                });

            }

            res.json(row);

        }

    );

});


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});
