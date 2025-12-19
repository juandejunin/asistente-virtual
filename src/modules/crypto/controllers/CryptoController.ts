// src/controllers/CryptoController.ts
import { Request, Response } from 'express';
import { CryptoService } from '../services/CryptoService';

export class CryptoController {
    // ✅ GET /api/crypto/top
    static async getTopCryptos(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const cryptos = await CryptoService.getTopCryptos(limit);
            
            res.json({
                success: true,
                count: cryptos.length,
                data: cryptos,
                timestamp: new Date().toISOString(),
                cached: cryptos[0]?._fallback || false
            });
            
        } catch (error: unknown) {
            console.error('Error in getTopCryptos:', error);
            
            res.status(500).json({
                success: false,
                error: 'Failed to fetch crypto data',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // ✅ GET /api/crypto/:id
    static async getCryptoById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const crypto = await CryptoService.getCryptoById(id.toLowerCase());
            
            if (!crypto) {
                return res.status(404).json({
                    success: false,
                    error: 'Cryptocurrency not found'
                });
            }
            
            res.json({
                success: true,
                data: crypto,
                timestamp: new Date().toISOString()
            });
            
        } catch (error: unknown) {
            console.error('Error in getCryptoById:', error);
            
            res.status(500).json({
                success: false,
                error: 'Failed to fetch cryptocurrency data'
            });
        }
    }

    // ✅ GET /api/crypto/top5 (para sección resumen)
    static async getTop5(req: Request, res: Response) {
        try {
            const cryptos = await CryptoService.getTop5();
            
            res.json({
                success: true,
                data: cryptos,
                timestamp: new Date().toISOString()
            });
            
        } catch (error: unknown) {
            console.error('Error in getTop5:', error);
            
            res.status(500).json({
                success: false,
                error: 'Failed to fetch top 5 cryptos'
            });
        }
    }
}