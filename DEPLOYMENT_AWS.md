# AWS Deployment Guide (бүгд үнэгүй)

Энэ гарын авлага нь lost-found project-ийг AWS-д **бүрэн үнэгүй** deploy хийх алхамуудыг тайлбарлана.

## Architecture

```
                      ┌──────────────────────────────┐
   User (browser) ──► │  AWS Amplify (Next.js)       │ — HTTPS, free
                      │  https://<id>.amplifyapp.com │
                      └──────────────┬───────────────┘
                                     │ NEXT_PUBLIC_API_URL
                                     ▼
                      ┌──────────────────────────────┐
                      │  Cloudflare Tunnel           │ — HTTPS proxy, free
                      │  https://<x>.trycloudflare.com│
                      └──────────────┬───────────────┘
                                     │ localhost:8080
                                     ▼
                      ┌──────────────────────────────┐
                      │  AWS EC2 t2.micro            │ — 12 сар free
                      │  Express + PM2               │
                      └──────────────┬───────────────┘
                                     │ MONGO_URI
                                     ▼
                      ┌──────────────────────────────┐
                      │  MongoDB Atlas M0            │ — forever free, 512MB
                      └──────────────────────────────┘
```

## Үнэгүй квот

| Үйлчилгээ | Free хэмжээ | Үргэлжлэх хугацаа |
|---|---|---|
| AWS Amplify | 1000 build мин/сар, 15GB transfer | Forever free tier |
| AWS EC2 t2.micro | 750 цаг/сар (1 instance 24/7) | 12 сар (шинэ account) |
| Cloudflare Tunnel | Хязгааргүй HTTPS proxy | Forever |
| MongoDB Atlas M0 | 512MB DB | Forever |

> ⚠️ EC2 нь 12 сарын дараа цагаар тооцох ($8/сар). Хэрэв удаан хугацаанд ажиллуулах бол [other-options.md](#бусад-сонголтууд) хэсгийг үзнэ үү.

---

## 1. MongoDB Atlas (аль хэдийн ажиллаж байгаа)

[backend/.env](backend/.env)-д тохируулсан Atlas connection string production-д ашиглагдана. Шинээр хийх зүйлгүй, гэхдээ:

1. [cloud.mongodb.com](https://cloud.mongodb.com) → Network Access → `0.0.0.0/0` нэмэх (бүх IP-ээс хандах). Production-д аюулгүй болгохын тулд дараа нь EC2-ийн IP-ээр солих.
2. Database Access-д үүсгэсэн user-ийн нууц үг хадгалсан эсэхээ шалга.
3. Connection string (`mongodb+srv://...`) хуулж аваарай.

---

## 2. Backend → AWS EC2

### 2.1. EC2 instance үүсгэх

1. [AWS Console](https://console.aws.amazon.com) → EC2 → **Launch Instance**
2. Settings:
   - **Name**: `lost-found-backend`
   - **AMI**: Amazon Linux 2023 (Free tier eligible)
   - **Instance type**: `t2.micro` (Free tier eligible)
   - **Key pair**: Шинээр үүсгээд `.pem` файл татаж аваарай (жнь: `lost-found-key.pem`)
   - **Network settings**:
     - Allow SSH (port 22) from "My IP"
     - Allow HTTP/HTTPS-ийг **зөвшөөрөх хэрэггүй** — Cloudflare Tunnel ашиглана
   - **Storage**: 8 GB gp3 (free tier 30GB хүртэл)
3. **Launch instance** дарна.

### 2.2. SSH-аар холбогдох

```bash
chmod 400 ~/Downloads/lost-found-key.pem
ssh -i ~/Downloads/lost-found-key.pem ec2-user@<EC2_PUBLIC_IP>
```

### 2.3. Server тохиргоо

EC2 дотор дараах командуудыг ажиллуул:

```bash
# Node.js 20 суулгах
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs git

# PM2 суулгах (Node process manager)
sudo npm install -g pm2

# Repo татах
git clone https://github.com/<your-username>/3-alhaad-ol.git lost-found
cd lost-found/backend

# Dependencies
npm ci --production

# Environment variables үүсгэх
cat > .env << 'EOF'
PORT=8080
NODE_ENV=production
MONGO_URI=<your-atlas-connection-string>
JWT_SECRET=<generate-with: openssl rand -hex 32>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://<placeholder>.amplifyapp.com
EOF

# JWT_SECRET үүсгэх
openssl rand -hex 32

# PM2-оор ажиллуулах
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # гарсан командыг дахин ажиллуул (sudo-той)

# Health шалгах
curl http://localhost:8080/health
# Хариу: {"ok":true,"service":"lost-found-backend"}
```

### 2.4. Cloudflare Tunnel суулгах (үнэгүй HTTPS)

EC2 дотор:

```bash
# cloudflared суулгах
sudo curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.rpm -o cloudflared.rpm
sudo rpm -i cloudflared.rpm

# Quick tunnel эхлүүлэх (домэйн хэрэггүй)
cloudflared tunnel --url http://localhost:8080
```

Гаралт:

```
Your quick Tunnel has been created! Visit it at:
https://random-words-xxx.trycloudflare.com
```

Энэ URL-г хадгалаарай — `NEXT_PUBLIC_API_URL` болно.

**Системийн service болгох** (тунел EC2 reboot хийсэн ч ажиллахын тулд):

```bash
sudo tee /etc/systemd/system/cloudflared.service > /dev/null << 'EOF'
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
ExecStart=/usr/bin/cloudflared tunnel --url http://localhost:8080
Restart=always
User=ec2-user

[Service]
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared
```

> ⚠️ Quick tunnel-ийн URL нь reboot бүрд өөрчлөгдөнө. Тогтмол URL хүсэх бол free Cloudflare account үүсгээд named tunnel ашиглаарай ([гарын авлага](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/)).

---

## 3. Frontend → AWS Amplify

### 3.1. Repo бэлдэх

```bash
# Local дээр
git add .
git commit -m "Configure for AWS deployment"
git push origin main
```

### 3.2. Amplify дээр deploy хийх

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify) → **New app** → **Host web app**
2. **GitHub** сонгоод authorize хийнэ.
3. Repo: `3-alhaad-ol`, branch: `main`.
4. **App settings**:
   - Build settings автоматаар [amplify.yml](amplify.yml)-г уншина.
   - **Environment variables** хэсэгт нэмэх:
     ```
     NEXT_PUBLIC_API_URL = https://<your-tunnel>.trycloudflare.com
     ```
5. **Save and deploy**.

Build 3-5 минут үргэлжилнэ. Дуусахад URL гарна: `https://main.d1234abcd.amplifyapp.com`.

### 3.3. CORS-ийг шинэчлэх

EC2 дотор:

```bash
cd /home/ec2-user/lost-found/backend
nano .env
# CORS_ORIGIN=https://main.d1234abcd.amplifyapp.com
pm2 restart lost-found-backend
```

---

## 4. Шалгах

1. Frontend URL: `https://main.d1234abcd.amplifyapp.com` нээгээд харагдах ёстой.
2. Browser DevTools → Network → API дуудлагууд `*.trycloudflare.com` руу 200 буцаах ёстой.
3. `/posts-live` хуудас → MongoDB-аас зар үзүүлэх ёстой.

---

## Troubleshooting

| Алдаа | Шалтгаан | Засах |
|---|---|---|
| `CORS error` browser console-д | `CORS_ORIGIN` буруу эсвэл restart хийгээгүй | EC2-ийн `.env`-ийн `CORS_ORIGIN`-г Amplify URL-ээр сольж `pm2 restart` |
| `Mixed content` блоклогдох | Backend HTTPS биш | Cloudflare Tunnel-ийн HTTPS URL ашигла, HTTP биш |
| `502/connection refused` | Backend унтарсан | `pm2 status`, `pm2 logs lost-found-backend` |
| Amplify build fail | Node version mismatch | Amplify settings → Build image-г Node 20 болгох |
| MongoDB connection timeout | Atlas IP whitelist | Atlas → Network Access → 0.0.0.0/0 нэмэх |

---

## Орчны хувьсагчуудын товчоо

### Frontend (Amplify env vars)

```
NEXT_PUBLIC_API_URL=https://<tunnel>.trycloudflare.com
```

### Backend ([EC2 backend/.env](backend/.env))

```
PORT=8080
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=<openssl rand -hex 32>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://<amplify-url>.amplifyapp.com
```

---

## Бусад сонголтууд

EC2 12 сарын free хугацаа дуусаад дараах хувилбарууд free хэвээр үлдэнэ:

- **Fly.io** — 3 хүртэлх жижиг VM үнэгүй, HTTPS дотооддоо
- **Render.com** — Backend free tier (project-д аль хэдийн [render.yaml](render.yaml) бий)
- **Railway.app** — $5 credit/сар
- **Oracle Cloud Free Tier** — Always free 2 VM
