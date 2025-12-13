import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import dotenv from "dotenv";

dotenv.config(); // cargar variables del .env

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const role = process.env.ADMIN_ROLE as "admin" | "super_admin";

  if (!username || !password || !role) {
    console.error("❌ ERROR: Variables de entorno faltantes (ADMIN_*)");
    process.exit(1);
  }

  // Conectar a la base de datos
  await connectToDatabase();

  const exists = await UserModel.findOne({ username });
  if (exists) {
    console.log("⚠️ El usuario admin ya existe.");
    await disconnectFromDatabase();
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    username,
    password: hashed,
    role,
  });

  console.log("✅ Usuario creado en la base:", user);
  
  // Desconectar
  await disconnectFromDatabase();
  process.exit(0);
}

createAdmin();
