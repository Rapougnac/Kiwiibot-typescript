import i18n from 'i18n';
import type { Request, Response, NextFunction } from 'express';
import * as path from 'path';

export default function (
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const lang =
        req.query['lang'] || req.cookies?.lang || req.headers['accept-language'] || 'en'; // <- Fallback to English
    i18n.configure({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        directory: path.join(process.cwd(), 'locales'),
        objectNotation: true,
    });

    i18n.setLocale(lang);
    return next();
}
