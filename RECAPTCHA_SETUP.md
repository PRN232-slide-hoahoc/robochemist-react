# Google reCAPTCHA v2 Setup Guide

## 🔐 Tại sao cần reCAPTCHA?

reCAPTCHA giúp bảo vệ form đăng ký khỏi spam và bot tự động, đặc biệt quan trọng khi hệ thống chưa có email xác nhận.

## 📋 Các bước cấu hình

### 1. Lấy reCAPTCHA Keys

1. Truy cập [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Đăng nhập bằng tài khoản Google
3. Bấm **Create** (+) để tạo site mới
4. Điền thông tin:
   - **Label**: RoboChemist (hoặc tên project của bạn)
   - **reCAPTCHA type**: Chọn **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
   - **Domains**: 
     - `localhost` (cho development)
     - Domain production của bạn (VD: `robochemist.com`)
   - **Owners**: Email của bạn
   - Chấp nhận Terms of Service
5. Bấm **Submit**

### 2. Copy Site Key

Sau khi tạo xong, bạn sẽ nhận được:
- **Site Key** (Public key - dùng trong frontend)
- **Secret Key** (Private key - dùng trong backend để verify)

### 3. Cập nhật `.env`

Mở file `.env` và thay thế test key bằng Site Key thật:

```bash
# Google reCAPTCHA v2 Site Key
VITE_RECAPTCHA_SITE_KEY=your_real_site_key_here
```

⚠️ **Lưu ý**: 
- Test key hiện tại (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`) chỉ hoạt động trên localhost và luôn trả về success
- Production PHẢI dùng key thật của bạn

### 4. Backend Verification (Optional nhưng recommended)

Để bảo mật tốt hơn, backend nên verify reCAPTCHA token:

#### a. Thêm endpoint verify vào AuthService

```csharp
// Models/VerifyRecaptchaRequest.cs
public class VerifyRecaptchaRequest
{
    public string Token { get; set; }
}

// Controllers/UserController.cs
[HttpPost("verify-recaptcha")]
public async Task<IActionResult> VerifyRecaptcha([FromBody] VerifyRecaptchaRequest request)
{
    var secretKey = _configuration["ReCaptcha:SecretKey"];
    var client = new HttpClient();
    
    var response = await client.PostAsync(
        $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={request.Token}",
        null
    );
    
    var result = await response.Content.ReadAsStringAsync();
    var recaptchaResult = JsonSerializer.Deserialize<RecaptchaResponse>(result);
    
    return Ok(new { success = recaptchaResult.Success });
}
```

#### b. Cập nhật appsettings.json

```json
{
  "ReCaptcha": {
    "SiteKey": "your_site_key",
    "SecretKey": "your_secret_key"
  }
}
```

#### c. Verify trong Register endpoint

```csharp
[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequest request)
{
    // Verify reCAPTCHA trước khi đăng ký
    if (!await VerifyRecaptchaToken(request.RecaptchaToken))
    {
        return BadRequest(new { message = "reCAPTCHA verification failed" });
    }
    
    // Continue with registration...
}
```

## 🧪 Testing

### Test với Test Key (Localhost)

Test key luôn pass validation:
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

### Test với Production Key

1. Deploy lên server
2. Đảm bảo domain đã được thêm vào reCAPTCHA Admin Console
3. Test form đăng ký

## 🎨 Customization

### Theme

reCAPTCHA component hỗ trợ 2 theme:

```tsx
<ReCAPTCHA
  theme="light"  // Hoặc "dark"
  ...
/>
```

### Size

```tsx
<ReCAPTCHA
  size="normal"    // Hoặc "compact", "invisible"
  ...
/>
```

### Language

```tsx
<ReCAPTCHA
  hl="vi"  // Vietnamese
  ...
/>
```

## 📚 Tài liệu tham khảo

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)
- [react-google-recaptcha](https://github.com/dozoisch/react-google-recaptcha)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)

## 🔒 Security Best Practices

1. ✅ **ALWAYS verify token on backend** - Frontend validation có thể bị bypass
2. ✅ **Never expose Secret Key** - Chỉ lưu trong backend environment variables
3. ✅ **Use production keys in production** - Không dùng test key trên production
4. ✅ **Set proper domains** - Chỉ thêm domains bạn sở hữu
5. ✅ **Monitor reCAPTCHA analytics** - Kiểm tra spam attempts trong Admin Console
