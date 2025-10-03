import bcrypt, { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const email = "admin@example.com";
  const plainPassword = "09027393534sajjadmirsjd0902m1704";
  const name = "Admin";

  const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(plainPassword, salt);

  console.log(hashed);
}

main();
