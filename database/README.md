# Database Setup Instructions

Bu dosya, AI Çözümler SaaS projesi için Supabase veritabanı kurulum talimatlarını içerir.

## 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adını, veritabanı şifresini ve bölgeyi seçin
4. Proje oluşturulduktan sonra Settings > API sayfasından URL ve anon key'i kopyalayın

## 2. Environment Variables

`.env` dosyanızı oluşturun ve aşağıdaki değerleri ekleyin:

```bash
VITE_PUBLIC_SUPABASE_URL=your_supabase_project_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Database Schema Kurulumu

Supabase Dashboard'da SQL Editor'e gidin ve `schema.sql` dosyasının içeriğini çalıştırın.

### Adım adım:
1. Supabase Dashboard > SQL Editor
2. "New Query" butonuna tıklayın
3. `database/schema.sql` dosyasının tüm içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. "Run" butonuna tıklayın

## 4. Oluşturulan Tablolar

### Ana Tablolar:
- **tenants**: Multi-tenant yapısı için kiracı bilgileri
- **profiles**: Kullanıcı profil bilgileri (auth.users'a bağlı)
- **encrypted_data**: Şifrelenmiş kullanıcı verileri
- **tenant_members**: Kiracı üyeleri (çoklu kullanıcı desteği)
- **subscription_history**: Abonelik geçmişi
- **usage_logs**: Kullanım logları ve analitik

### Özellikler:
- ✅ Row Level Security (RLS) aktif
- ✅ Otomatik timestamps (created_at, updated_at)
- ✅ UUID primary keys
- ✅ Foreign key constraints
- ✅ Proper indexing
- ✅ Multi-tenant veri izolasyonu

## 5. RLS Politikaları

Aşağıdaki güvenlik politikaları otomatik olarak uygulanır:

### Profiles
- Kullanıcılar sadece kendi profillerini görebilir/düzenleyebilir

### Encrypted Data
- Kullanıcılar sadece kendi verilerini görebilir
- Paylaşılan veriler için ek erişim kontrolü
- Kiracı seviyesinde veri izolasyonu

### Tenants
- Kullanıcılar sadece üye oldukları kiracıları görebilir
- Sadece owner/admin roller kiracı bilgilerini düzenleyebilir

## 6. Doğrulama

Schema kurulumu başarılı olduğunu doğrulamak için:

1. Supabase Dashboard > Table Editor'e gidin
2. Aşağıdaki tabloların oluşturulduğunu kontrol edin:
   - tenants
   - profiles
   - encrypted_data
   - tenant_members
   - subscription_history
   - usage_logs

3. Authentication > Settings'de RLS'in aktif olduğunu kontrol edin

## 7. Test Verisi (Opsiyonel)

Geliştirme için test verisi eklemek istiyorsanız:

```sql
-- Test tenant oluştur
INSERT INTO tenants (name, slug, sector, subscription_plan) VALUES
('Test Diş Kliniği', 'test-dis-klinigi', 'dentist', 'free');

-- Test kullanıcısı kayıt olduktan sonra profil otomatik oluşturulacak
```

## 8. Güvenlik Notları

### Kritik Güvenlik Ayarları:
- ✅ RLS tüm tablolarda aktif
- ✅ Sadece authenticated kullanıcılar veri erişimi
- ✅ Kullanıcılar sadece kendi verilerine erişim
- ✅ Multi-tenant veri izolasyonu

### Production Öncesi Kontrol Listesi:
- [ ] Environment variables production'da güvenli
- [ ] RLS politikaları test edildi
- [ ] Backup stratejisi belirlendi
- [ ] Monitoring kuruldu
- [ ] Rate limiting yapılandırıldı

## 9. Sorun Giderme

### Yaygın Hatalar:

**"relation does not exist" hatası:**
- Schema'nın tamamen çalıştırıldığından emin olun
- Tablolar oluşturulana kadar bekleyin

**RLS policy hatası:**
- Kullanıcının giriş yaptığından emin olun
- Policy'lerin doğru kullanıcıya uygulandığını kontrol edin

**Permission denied hatası:**
- RLS politikalarını kontrol edin
- Kullanıcının doğru role sahip olduğunu doğrulayın

## 10. Destek

Sorunlarla karşılaştığınızda:
1. Supabase Dashboard > Logs'u kontrol edin
2. Browser developer console'u kontrol edin
3. RLS politikalarını tekrar gözden geçirin

---

**Not**: Bu kurulum talimatları development ortamı içindir. Production ortamında ek güvenlik ve performans optimizasyonları gerekebilir.
