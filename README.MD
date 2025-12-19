# 🌍 Despertar Digital API - Datos en Tiempo Real

**API completa para datos económicos, climáticos y deportivos en tiempo real**

[![API Status](https://img.shields.io/badge/status-operational-brightgreen)](https://despertardigital.es)
[![Swagger Docs](https://img.shields.io/badge/docs-swagger-blue)](https://despertardigital.es/api-docs)
[![Node.js](https://img.shields.io/badge/node-18%2B-green)](https://nodejs.org/)

## 📊 Módulos Disponibles

### 🇦🇷 **Economía Argentina** 
- **Dólares**: 7 tipos (blue, oficial, CCL, MEP, tarjeta, mayorista, cripto)
- **Cotizaciones**: EUR, BRL, UYU, CLP (Banco Nación)
- **Dashboard**: Vista unificada de toda la economía argentina

### 🌍 **Forex Internacional**
- **Divisas principales**: EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD
- **Latinoamérica**: BRL, MXN
- **Conversor**: Conversión en tiempo real entre +150 divisas

### ₿ **Criptomonedas**
- **Top 100**: Principales criptomonedas por capitalización
- **Detalles**: Precios históricos, ATH/ATL, variaciones
- **Top 5**: Endpoint optimizado para dashboards

### 📈 **Economía Global** (Dashboards)
- **Global**: Forex + Crypto
- **Argentina**: Dólares + Cotizaciones
- **Completo**: Todos los servicios integrados
- **Unificado**: Forex con ARS integrado

### ⚽ **Deportes**
- **En desarrollo**: Fútbol, básquet, tenis

### 🌤️ **Clima**
- **Actual**: Condiciones meteorológicas
- **Pronóstico**: Predicciones
- **Notificaciones**: Alertas automáticas por Telegram

## 🚀 Demo en Vivo

**URL de producción**: https://despertardigital.es

**Documentación API**: https://despertardigital.es/api-docs

**Ejemplos rápidos**:
```bash
# Dólar blue actual
curl https://despertardigital.es/api/economy/argentina/dolares

# Forex internacional
curl https://despertardigital.es/api/forex/global

# Top 5 criptomonedas
curl https://despertardigital.es/api/crypto/top5

# Dashboard completo
curl https://despertardigital.es/api/economy/complete

src/
├── modules/
│   ├── argentina/          # Economía argentina
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── types/
│   ├── forex/              # Divisas internacionales
│   ├── crypto/             # Criptomonedas
│   ├── economy/            # Dashboards globales
│   └── deportes/           # Datos deportivos
├── config/
│   ├── Server.ts           # Servidor principal
│   ├── swagger/            # Documentación API
│   └── database/           # Conexión a DB
├── services/               # Servicios compartidos
├── routes/                 # Rutas legacy
├── controllers/            # Controladores legacy
├── cron/                   # Tareas programadas
└── index.ts               # Punto de entrada
```

## 🛠️Tecnologías Utilizadas
Backend
Node.js + TypeScript - Runtime y tipado estático

Express.js - Framework web

WebSocket - Comunicación en tiempo real

Swagger/OpenAPI - Documentación automática

APIs Externas
Frankfurter.app - Tasas de cambio Forex (gratuita)

CoinGecko API - Precios de criptomonedas (gratuita)

DolarAPI.com - Dólar argentino (gratuita)

OpenWeatherMap - Datos meteorológicos

TheSportsDB - Resultados deportivos

Utilidades
node-cron - Tareas programadas

Telegram Bot API - Notificaciones

CORS - Acceso cross-origin

dotenv - Variables de entorno

### ⚙️ Configuración Local
1. Clonar repositorio

```
git clone https://github.com/juandejunin/asistente-virtual.git
cd asistente-virtual
```

2. Instalar dependencias

```
npm install
```

3. Configurar variables de entorno

```
# Servidor
PORT=3000
NODE_ENV=development

# APIs Económicas
COTIZACIONES_API_URL=https://api.example.com/cotizaciones
DOLARES_API_URL=https://dolarapi.com/v1/dolares

# Forex
FOREX_API_URL=https://api.frankfurter.app

# Crypto
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Clima
OPENWEATHER_API_KEY=tu_clave_aqui
CITY=Buenos Aires

# Telegram (opcional)
TELEGRAM_TOKEN=tu_token
TELEGRAM_CHAT_ID=tu_chat_id
```

4. Iniciar servidor

```
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm run build
npm start 
```