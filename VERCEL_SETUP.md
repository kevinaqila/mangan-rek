# Vercel Setup Instructions

## Environment Variables yang harus di-set di Vercel Dashboard:

1. Pergi ke https://vercel.com
2. Pilih project `mangan-rek-backend`
3. Klik "Settings" → "Environment Variables"
4. Add variables berikut:

```
MONGODB_URL
mongodb+srv://farrelahmadkevinaqila_db_user:kitsAxnf05SvkY6f@cluster0.ivc5r1t.mongodb.net/manganrek_db?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
mysecretkey

NODE_ENV
production

CLOUDINARY_CLOUD_NAME
dh0d2eb6g

CLOUDINARY_API_KEY
643129163659221

CLOUDINARY_API_SECRET
7yCvZHv7lvbgjCbvTCXWjRAGsKc
```

5. Klik "Save"
6. Redeploy dari "Deployments" tab

## MongoDB Atlas Whitelist:

1. Pergi ke https://www.mongodb.com/cloud/atlas
2. Login ke account Anda
3. Pilih cluster `Cluster0`
4. Klik "Network Access"
5. Whitelist IP `0.0.0.0/0` (Allow all IPs)
   - Atau whitelist Vercel IPs (lebih secure)

## Test Connection:

Run: `npm run test-mongo`

Jika test berhasil locally tapi tidak di Vercel, berarti env variables tidak set di Vercel.
