# 🌤️ Aplicación de Clima con Notificaciones por Telegram
Descripción

Esta aplicación permite obtener información meteorológica de una ciudad específica y enviar notificaciones automáticas de clima a Telegram.
Además, cuenta con un servicio web REST para consultar el clima en tiempo real y para configurar dinámicamente la ciudad y el horario de envío de las notificaciones.

🏗️ Estructura del Proyecto

```
src/
├─ config/
│  └─ Server.ts            # Configuración y arranque del servidor HTTP + WebSocket
├─ controllers/
│  ├─ WeatherController.ts # Lógica para endpoints de clima
│  └─ ConfigController.ts  # Lógica para endpoints de configuración (ciudad y horario)
├─ cron/
│  └─ weatherCron.ts       # Cron job para enviar actualizaciones automáticas
├─ routes/
│  ├─ weather.routes.ts    # Rutas para consultar clima
│  └─ config.routes.ts     # Rutas para configurar ciudad y horario
├─ services/
│  ├─ WeatherService.ts    # Servicio que obtiene datos de OpenWeather
│  ├─ WeatherNotifier.ts   # Servicio que envía mensajes a Telegram
│  ├─ TelegramService.ts   # Servicio que envía mensajes usando API de Telegram
│  └─ ConfigService.ts     # Servicio que maneja la configuración dinámica
├─ scripts/
│  └─ sendWeatherMessage.ts # Script independiente para enviar el clima una vez
└─ index.ts                # Punto de entrada principal de la aplicación


```
## ⚙️ Funcionalidad

Obtener el clima actual de la ciudad configurada

```
Endpoint: GET /api/weather/today
```
Devuelve el estado del clima, temperatura y humedad.

Configurar la ciudad y horario de notificación
```
Endpoint: GET /api/config → Ver configuración actual

Endpoint: POST /api/config → Actualizar ciudad y/o horario del cron
```
El cron se reinicia automáticamente al actualizar la configuración.

Notificaciones automáticas de clima vía Telegram

El cron se ejecuta según la configuración y envía un mensaje a un chat de Telegram con:
```
Ciudad

Estado del clima

Temperatura

Humedad
```

### Soporte de errores

Maneja cuerpos de request que no sean JSON o estén mal formados.

Devuelve errores claros (400 Bad Request, 415 Unsupported Media Type).


## 🛠️ Tecnologías utilizadas

Node.js con TypeScript → Backend tipado y moderno

Express.js → Servidor HTTP y rutas REST

WebSocket (ws) → Comunicación en tiempo real opcional

node-cron → Tareas programadas para enviar clima automáticamente

OpenWeather API → Fuente de datos meteorológicos

Telegram Bot API → Envío de mensajes al chat de Telegram

dotenv → Variables de entorno para configuración segura


## 🏃‍♂️ Cómo ejecutar la aplicación

Clonar el repositorio
```
git clone <url-del-repo>
cd <nombre-del-repo>
```

Instalar dependencias
```
npm install
```

Configurar variables de entorno
Crear un archivo .env con:

```
PORT=3000
CITY=Buenos Aires
OPENWEATHER_API_KEY=<tu_api_key>
TELEGRAM_TOKEN=<tu_token>
TELEGRAM_CHAT_ID=<tu_chat_id>
```

Iniciar la aplicación
```
npm run dev
```

Endpoints disponibles
```
Método	Ruta	Descripción
GET	/api/weather/today	Obtener clima actual
GET	/api/config	Ver configuración actual
POST	/api/config	Actualizar ciudad y/o horario
POST	/api/config/city	Actualizar solo la ciudad
POST	/api/config/schedule	Actualizar solo el horario del cron

```
💡 Notas

Los cambios de ciudad y horario se aplican dinámicamente, sin reiniciar el servidor.

La configuración actual se mantiene en memoria, pero se puede extender para persistir en archivo JSON o base de datos.

Los mensajes de Telegram siempre reflejan la ciudad actual configurada, no la del .env.