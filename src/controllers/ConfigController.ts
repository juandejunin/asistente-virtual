import { Request, Response } from "express";
import ConfigService from "../services/ConfigService";
import { restartWeatherCron } from "../cron/weatherCron";

// Convierte "HH:MM" a cron "m h * * *"
function convertTimeToCron(time: string): string {
  const [hour, minute] = time.split(":");
  if (hour === undefined || minute === undefined) {
    throw new Error("Horario inválido, debe ser HH:MM");
  }
  return `${minute} ${hour} * * *`;
}

class ConfigController {
  // GET /api/config
  public getConfig = (req: Request, res: Response): void => {
    try {
      const config = ConfigService.getConfig();
      console.log("⚙️ Configuración actual cargada: ", config);
      res.status(200).json({ message: "⚙️ Configuración actual", data: config });
    } catch (err) {
      console.error("❌ Error al obtener configuración:", err);
      res.status(500).json({ message: "Error interno del servidor", error: String(err) });
    }
  };

  // POST /api/config
  public updateConfig = (req: Request, res: Response): void => {
    try {
      const { city, cronSchedule: time } = req.body;

      if (!city && !time) {
        res.status(400).json({ message: "Debe enviar al menos un campo: city o cronSchedule" });
        return;
      }

      // Convertir horario a cron válido si se envía
      const cronSchedule = time ? convertTimeToCron(time) : undefined;

      const updated = ConfigService.updateConfig({ city, cronSchedule });

      // Reiniciar cron si hay nuevo horario
      if (cronSchedule) {
        restartWeatherCron(updated.cronSchedule);
        console.log("⏰ Horario de envío actualizado a:", time);
      }

      if (city) console.log("🏙️ Ciudad actualizada a:", city);

      res.status(200).json({
        message: "✅ Configuración actualizada correctamente",
        data: updated,
      });
    } catch (err) {
      console.error("❌ Error en updateConfig:", err);
      res.status(500).json({ message: "Error interno del servidor", error: String(err) });
    }
  };
}

export default ConfigController;
