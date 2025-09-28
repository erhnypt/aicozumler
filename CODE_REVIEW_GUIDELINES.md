# Code Review Guidelines

Bu döküman, AI Çözümler projesi için kod inceleme (code review) standartlarını ve en iyi uygulamaları tanımlar.

## 🎯 Amaç

- Kod kalitesini artırmak
- Hataları erken tespit etmek
- Bilgi paylaşımını sağlamak
- Tutarlı kod standartları oluşturmak
- Güvenlik açıklarını önlemek

## 📋 Review Checklist

### ✅ Genel Kontroller

- [ ] **Kod çalışıyor mu?** - Fonksiyonlar beklendiği gibi çalışıyor mu?
- [ ] **Testler var mı?** - Yeni kod için unit testler yazılmış mı?
- [ ] **Performans etkileri** - Kod performansı olumsuz etkileyecek değişiklikler var mı?
- [ ] **Güvenlik** - Potansiyel güvenlik açıkları var mı?
- [ ] **Dokümantasyon** - Karmaşık kod parçaları dokümante edilmiş mi?

### 🔧 Teknik Kontroller

#### TypeScript/JavaScript
- [ ] **Type Safety** - Proper TypeScript types kullanılmış mı?
- [ ] **Error Handling** - Hatalar uygun şekilde yakalanıp işleniyor mu?
- [ ] **Async/Await** - Promise'ler doğru şekilde handle ediliyor mu?
- [ ] **Memory Leaks** - Event listener'lar ve subscription'lar temizleniyor mu?
- [ ] **ESLint Rules** - Linting kurallarına uyuluyor mu?

#### React Specific
- [ ] **Hook Rules** - React Hook kurallarına uyuluyor mu?
- [ ] **Re-renders** - Gereksiz re-render'lar önlenmiş mi?
- [ ] **Key Props** - List render'larda unique key'ler kullanılmış mı?
- [ ] **Accessibility** - ARIA labels ve semantic HTML kullanılmış mı?
- [ ] **Component Design** - Component'ler single responsibility principle'a uygun mu?

#### Performance
- [ ] **Bundle Size** - Yeni dependency'ler bundle size'ı önemli ölçüde artırıyor mu?
- [ ] **Lazy Loading** - Büyük component'ler lazy load ediliyor mu?
- [ ] **Memoization** - Expensive calculations memoize edilmiş mi?
- [ ] **Image Optimization** - Görseller optimize edilmiş mi?

### 🎨 Stil ve Tutarlılık

- [ ] **Naming Conventions** - Değişken ve fonksiyon isimleri açıklayıcı mı?
- [ ] **Code Style** - Prettier ve ESLint kurallarına uygun mu?
- [ ] **File Organization** - Dosyalar mantıklı şekilde organize edilmiş mi?
- [ ] **Import Order** - Import'lar doğru sırada mı?
- [ ] **Comments** - Gerekli yerlerde yorum eklenmiş mi?

### 🔐 Güvenlik Kontrolleri

- [ ] **Input Validation** - Kullanıcı girdileri validate ediliyor mu?
- [ ] **XSS Prevention** - Cross-site scripting saldırılarına karşı korunma var mı?
- [ ] **CSRF Protection** - CSRF token'ları kullanılıyor mu?
- [ ] **Sensitive Data** - Hassas veriler log'lara yazılmıyor mu?
- [ ] **Environment Variables** - Gizli bilgiler environment variable'larda mı?

## 🚀 Review Süreci

### 1. Pull Request Oluşturma

```bash
# Feature branch oluştur
git checkout -b feature/new-feature

# Değişiklikleri commit et
git commit -m "feat: add new feature"

# Push ve PR oluştur
git push origin feature/new-feature
```

### 2. PR Template

```markdown
## 📝 Değişiklik Açıklaması
<!-- Ne değişti, neden değişti -->

## 🔗 İlgili Issue/Task
<!-- Closes #123 -->

## 🧪 Test Edildi
- [ ] Unit testler çalıştırıldı
- [ ] E2E testler çalıştırıldı
- [ ] Manuel test yapıldı

## 📸 Screenshots (UI değişiklikleri için)
<!-- Before/After screenshots -->

## ✅ Checklist
- [ ] Kod self-review yapıldı
- [ ] Testler eklendi/güncellendi
- [ ] Dokümantasyon güncellendi
- [ ] Breaking change yok veya CHANGELOG güncellendi
```

### 3. Review Süreci

1. **Automated Checks** - CI/CD pipeline'ın geçmesi
2. **Self Review** - Kendi kodunu gözden geçir
3. **Peer Review** - En az 1 team member review
4. **Senior Review** - Kritik değişiklikler için senior developer review
5. **Final Check** - Merge öncesi son kontrol

## 💬 Review Comments

### Constructive Feedback

✅ **İyi Örnek:**
```
Bu fonksiyon çok büyük olmuş. Daha küçük fonksiyonlara bölmek maintainability açısından faydalı olabilir.

Önerim:
- User validation'ı ayrı bir fonksiyona çıkar
- Database işlemlerini service layer'a taşı
```

❌ **Kötü Örnek:**
```
Bu kod berbat, yeniden yaz.
```

### Comment Types

- **💡 Suggestion:** İyileştirme önerileri
- **❗ Issue:** Düzeltilmesi gereken problemler  
- **❓ Question:** Anlaşılmayan kısımlar
- **👍 Praise:** İyi yapılmış kısımlar için övgü
- **📚 Learning:** Bilgi paylaşımı

## 🎯 Review Priorities

### 🔴 High Priority (Merge Blocker)
- Güvenlik açıkları
- Performans problemleri
- Breaking changes
- Test eksiklikleri
- Type safety problemleri

### 🟡 Medium Priority (Önemli ama blocker değil)
- Code style issues
- Refactoring önerileri
- Documentation eksiklikleri
- Minor performance improvements

### 🟢 Low Priority (Nice to have)
- Variable naming improvements
- Code organization
- Additional comments

## 📊 Review Metrics

### Takip Edilecek Metriler
- **Review Time:** PR oluşturma ile approve arasındaki süre
- **Review Coverage:** Review edilen kod satır sayısı
- **Bug Detection:** Review'da yakalanan bug sayısı
- **Review Participation:** Team member'ların review katılımı

### Hedefler
- ⏱️ **Review Time:** < 24 saat (küçük PR'lar için)
- 🎯 **Review Coverage:** %100 (tüm PR'lar review edilmeli)
- 🐛 **Bug Detection:** Erken tespit oranı artırılmalı

## 🛠️ Tools ve Automation

### Automated Checks
- **ESLint:** Code style ve quality
- **Prettier:** Code formatting
- **TypeScript:** Type checking
- **Tests:** Unit ve integration testler
- **Security Scan:** Dependency vulnerability check

### Review Tools
- **GitHub PR Reviews:** Comment ve approval sistemi
- **CodeClimate:** Automated code quality analysis
- **SonarQube:** Code quality ve security analysis

## 📚 Best Practices

### PR Size
- **Small PRs:** < 200 satır değişiklik (ideal)
- **Medium PRs:** 200-500 satır (kabul edilebilir)
- **Large PRs:** > 500 satır (mümkünse böl)

### Review Strategy
1. **Big Picture:** Genel yaklaşım doğru mu?
2. **Architecture:** Design pattern'lar uygun mu?
3. **Implementation:** Kod detayları doğru mu?
4. **Testing:** Test coverage yeterli mi?

### Communication
- **Be Kind:** Yapıcı ve saygılı ol
- **Be Specific:** Concrete örnekler ver
- **Be Timely:** Hızlı feedback ver
- **Be Thorough:** Dikkatli incele

## 🎓 Learning Resources

### Internal Resources
- [Coding Standards](./CODING_STANDARDS.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Security Guidelines](./SECURITY.md)

### External Resources
- [Google's Code Review Guidelines](https://google.github.io/eng-practices/review/)
- [Best Practices for Code Review](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/)
- [React Code Review Checklist](https://github.com/facebook/react/wiki/Reviewing-Pull-Requests)

## 📞 İletişim

Review süreciyle ilgili sorular için:
- **Slack:** #code-review kanalı
- **Email:** tech-lead@aicozumler.com
- **Daily Standup:** Günlük toplantılarda tartış

---

**Not:** Bu guidelines living document'tır ve sürekli güncellenir. Önerilerinizi paylaşın!
