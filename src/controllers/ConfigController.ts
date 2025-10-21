import { Request, Response } from "express";
import ConfigService from "../services/ConfigService";
import { restartWeatherCron } from "../cron/weatherCron";

class ConfigController {
  public getConfig = (req: Request, res: Response): void => {
    const config = ConfigService.getConfig();
    res.status(200).json({ message: "⚙️ Configuración actual", data: config });
  };

  public updateConfig = (req: Request, res: Response): void => {
    // ✅ Verifica tipo de contenido
    if (!req.is("application/json")) {
      res.status(415).json({
        message: "El tipo de contenido debe ser 'application/json'.",
      });
      return;
    }

    // ✅ Evita destructurar si el body es undefined o no tiene las propiedades esperadas
    const { city, cronSchedule } = req.body || {};

    if (!city && !cronSchedule) {
      res.status(400).json({
        message: "Debe enviar al menos un campo válido: 'city' o 'cronSchedule'.",
      });
      return;
    }

    const updated = ConfigService.updateConfig({ city, cronSchedule });

    // ✅ Reiniciar cron solo si cambia la configuración
    restartWeatherCron(updated.cronSchedule);

    res.status(200).json({
      message: "✅ Configuración actualizada correctamente",
      data: updated,
    });
  };
}

export default ConfigController;
