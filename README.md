# Labigel Cafe — Dijital Menü

Labigel Cafe (Batıkent) için hazırlanmış dijital menü sistemi. Müşterilerin kategori/ürün bazlı menüyü gezebildiği bir halka açık site ile ürün, kategori ve site ayarlarının yönetildiği bir admin paneli içerir.

## Teknoloji Yığını

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Java 17, Spring Boot (REST API, JWT auth)
- **Veritabanı:** PostgreSQL 15
- **Konteynerleştirme:** Docker Compose

## Proje Yapısı

```
labigel-cafe/
├── docker-compose.yml       # db + backend + frontend servisleri
├── labigel-frontend/        # Next.js uygulaması
└── labigel-backend/         # Spring Boot API
```

## Gereksinimler

- [Docker](https://www.docker.com/) ve Docker Compose (önerilen yöntem için)
- Manuel/geliştirme kurulumu için ayrıca: Node.js 20+, Java 17, Maven, PostgreSQL 15

## Hızlı Başlangıç (Docker Compose — önerilen)

En kolay yöntem budur; veritabanı, backend ve frontend'i tek komutla ayağa kaldırır.

```bash
git clone https://github.com/Expiyon/labigelcofee.git
cd labigelcofee
docker compose up -d --build
```

Servisler ayağa kalktıktan sonra (ilk açılışta backend, veritabanı boşsa varsayılan admin kullanıcısını ve site ayarlarını otomatik oluşturur):

| Servis   | Adres                          |
|----------|---------------------------------|
| Site (halka açık) | http://localhost:3001         |
| Admin paneli       | http://localhost:3001/admin/giris |
| Backend API        | http://localhost:8080/api     |
| PostgreSQL          | localhost:5432 (`labigel_db` / `labigel` / `labigel2024`) |

**Varsayılan admin girişi:**
- E-posta: `admin@labigel.com`
- Şifre: `Labigel2024!`

> Bu bilgiler yalnızca yerel geliştirme içindir. Gerçek bir sunucuya deploy edecekseniz `docker-compose.yml` içindeki veritabanı şifresini ve `JWT_SECRET` değerini değiştirin, ilk girişten sonra admin şifresini panelden güncelleyin.

Servisleri durdurmak için:

```bash
docker compose down
```

Verileri de silmek isterseniz (dikkat, geri dönüşü yok):

```bash
docker compose down -v
```

## Manuel Geliştirme Kurulumu

Frontend üzerinde canlı kod değişikliği (hot reload) ile çalışmak isterseniz backend + db'yi Docker'da bırakıp frontend'i doğrudan `npm run dev` ile çalıştırabilirsiniz.

### 1. Veritabanı ve Backend'i Docker ile başlatın

```bash
docker compose up -d db backend
```

Backend `http://localhost:8080` üzerinde ayağa kalkar.

### 2. Frontend'i yerelde çalıştırın

```bash
cd labigel-frontend
npm install
npm run dev
```

Varsayılan olarak `http://localhost:3000` adresinde açılır. **Docker'daki `labigel_frontend` konteyneri de aynı anda çalışıyorsa** (3001 portunu kullanır) port çakışması olmaz; ama 3000 portu başka bir uygulama tarafından kullanılıyorsa `npm run dev -- -p 3001` ile farklı bir port belirtebilirsiniz.

> Not: Backend CORS ayarı yalnızca `http://localhost:3000` ve `http://localhost:3001` origin'lerine izin verir (`labigel-backend/src/main/java/com/labigel/backend/config/CorsConfig.java`). Frontend'i farklı bir portta çalıştırırsanız API istekleri CORS hatası alır — bu durumda ilgili dosyaya kendi portunuzu ekleyin.

Frontend'in API adresini değiştirmek isterseniz `labigel-frontend/.env.local` dosyasını oluşturun:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

(Bu zaten varsayılan değerdir, dosya olmasa da çalışır.)

### 3. Backend'i de yerelde çalıştırmak isterseniz

```bash
docker compose up -d db
cd labigel-backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/labigel_db \
SPRING_DATASOURCE_USERNAME=labigel \
SPRING_DATASOURCE_PASSWORD=labigel2024 \
mvn spring-boot:run
```

> `dev` Spring profili (`application-dev.yml`) veritabanı için farklı bir şifre (`labigel123`) varsayar ve `docker-compose.yml`'deki veritabanıyla (`labigel2024`) uyuşmaz. Docker'daki veritabanına bağlanacaksanız yukarıdaki gibi ortam değişkenlerini elle verin ya da `application-dev.yml` içindeki şifreyi kendi kurulumunuza göre güncelleyin.

## Ortam Değişkenleri

| Değişken | Nerede | Açıklama | Varsayılan |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | frontend | Frontend'in backend'e istek attığı taban URL | `http://localhost:8080/api` |
| `SPRING_DATASOURCE_URL` | backend | PostgreSQL bağlantı adresi | `jdbc:postgresql://localhost:5432/labigel_db` |
| `SPRING_DATASOURCE_USERNAME` / `_PASSWORD` | backend | Veritabanı kullanıcı/şifre | `labigel` / `labigel2024` |
| `JWT_SECRET` | backend | Admin oturum token'larını imzalamak için kullanılan gizli anahtar | `docker-compose.yml` içinde tanımlı (geliştirme amaçlı) |
| `UPLOAD_DIR` | backend | Yüklenen görsellerin (logo, ürün, kategori) diskte tutulduğu klasör | `/app/uploads` |

## Faydalı Komutlar

```bash
# Servis loglarını izleme
docker compose logs -f frontend
docker compose logs -f backend

# Tek bir servisi yeniden derleyip başlatma
docker compose up -d --build frontend

# Veritabanına psql ile bağlanma
docker exec -it labigel_db psql -U labigel -d labigel_db
```

## Sorun Giderme

- **"port is already allocated" hatası:** 3001, 8080 veya 5432 portlarından biri başka bir uygulama tarafından kullanılıyor olabilir. `docker-compose.yml` içindeki ilgili `ports` eşlemesini değiştirin.
- **Admin girişinden sonra site ayarları/menü verisi yüklenmiyor:** Backend'in CORS ayarına frontend'i çalıştırdığınız origin'in ekli olduğundan emin olun.
- **Yüklenen görseller admin paneli yeniden başlatınca kayboluyor:** `docker-compose.yml` içindeki `backend_uploads` volume'ünün kalıcı olduğundan emin olun (`docker compose down -v` çalıştırmadığınız sürece veriler korunur).
