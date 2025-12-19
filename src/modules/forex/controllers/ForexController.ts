// src/controllers/ForexController.ts
import { Request, Response } from 'express';
import { ForexService } from '../services/ForexService';

export class ForexController {
    // ✅ Mantener compatibilidad con tu código existente
    static async getGlobalRates(req: Request, res: Response) {
        try {
            const [major, latam] = await Promise.all([
                ForexService.getMajorRates(),
                ForexService.getLatinAmericanRates()
            ]);
            
            res.json({ 
                success: true, 
                majorCurrencies: major,
                latinAmerica: latam,
                provider: 'Frankfurter.app',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error in getGlobalRates:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch forex data',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // ✅ NUEVO: Endpoint unificado
    static async getAllRates(req: Request, res: Response) {
        try {
            const allRates = await ForexService.getAllRates();
            
            res.json({ 
                success: true, 
                data: allRates,
                provider: 'Frankfurter.app',
                cached: allRates._fallback || false
            });
        } catch (error) {
            console.error('Error in getAllRates:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch forex data'
            });
        }
    }

    // ✅ NUEVO: Conversor de monedas (extra útil)
// src/controllers/ForexController.ts - Método convertCurrency CORREGIDO
static async convertCurrency(req: Request, res: Response) {
    try {
        const { amount = 1, from = 'USD', to = 'EUR' } = req.query;
        
        // Validar parámetros
        const amountNum = parseFloat(amount as string);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Amount must be a positive number' 
            });
        }
        
        const response = await fetch(
            `https://api.frankfurter.app/latest?amount=${amountNum}&from=${from}&to=${to}`
        );
        
        if (!response.ok) {
            throw new Error(`Conversion API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // ✅ VALIDAR que la respuesta tiene la estructura esperada
        if (!data || !data.rates || typeof data.rates !== 'object') {
            throw new Error('Invalid response from conversion API');
        }
        
        const rates = data.rates;
        const rateKeys = Object.keys(rates);
        
        if (rateKeys.length === 0) {
            throw new Error('No conversion rates available');
        }
        
        // Obtener la primera (y única) tasa de conversión
        const targetCurrency = rateKeys[0];
        const rate = rates[targetCurrency];
        
        // Calcular resultado
        const resultAmount = data.amount ? data.amount * rate : amountNum * rate;
        
        res.json({
            success: true,
            conversion: {
                amount: data.amount || amountNum,
                from: data.base || (from as string),
                to: targetCurrency,
                rate: rate,
                result: parseFloat(resultAmount.toFixed(4)),
                date: data.date || new Date().toISOString().split('T')[0]
            }
        });
        
    } catch (error: unknown) {
        console.error('Error in convertCurrency:', 
            error instanceof Error ? error.message : String(error)
        );
        
        res.status(400).json({ 
            success: false, 
            error: 'Invalid conversion parameters',
            message: error instanceof Error ? error.message : 'Conversion failed'
        });
    }
}
}