import bcrypt from "bcryptjs";

const users = [
  {
    name: "ادمین",
    email: "admin@email.com",
    password: bcrypt.hashSync("12345678", 10),
    isAdmin: true,
  },
  {
    name: "محمد کاظمی",
    email: "kazemi@gmail.com",
    password: bcrypt.hashSync("12345678", 10),
    isAdmin: false,
  },
  {
    name: "امیر موسوی",
    email: "mosavi@gmail.com",
    password: bcrypt.hashSync("12345678", 10),
    isAdmin: false,
  },
];

export default users;
