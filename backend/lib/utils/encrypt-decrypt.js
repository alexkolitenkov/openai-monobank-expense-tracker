import crypto from 'crypto';

const IV_LENGTH = 16;

export function encrypt(plainText, secret, algorithm = 'aes-256-cbc') {
    const key = crypto.createHash('sha512').update(secret).digest('hex').substring(0, 64);
    const iv     = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);

    const encrypted = Buffer.concat([ cipher.update(plainText), cipher.final() ]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(plainText, secret, algorithm = 'aes-256-cbc') {
    const key = crypto.createHash('sha512').update(secret).digest('hex').substring(0, 64);
    const textParts = plainText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');

    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);

    const decrypted = Buffer.concat([ decipher.update(encryptedText), decipher.final() ]);

    return decrypted.toString();
}
