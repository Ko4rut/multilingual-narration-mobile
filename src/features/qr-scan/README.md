# QR Scan — resolve POI audio

## Cấu trúc

- `components/QrScanScreen.tsx`: điều phối camera, loading, lỗi và kết quả.
- `components/QrScanViewfinder.tsx`: CameraView; giữ nguyên logic scanner/animation.
- `components/QrNarrationResult.tsx`: hiển thị POI/audio và mở URL MP3 để kiểm thử.
- `hooks/useQrScan.ts`: xin quyền camera, khóa quét lặp và mở khóa khi quét lại.
- `hooks/useQrResolution.ts`: gọi service, quản lý request/AbortController và React state.
- `services/qr-scan.api.ts`: gửi request HTTP, kiểm tra JSON, chuẩn hóa audio URL.
- `types/qr-scan.types.ts`: request/response từ backend và type cho UI.

## Luồng

1. Camera đọc nội dung QR, ví dụ `HAN-VAN-MIEU`.
2. `useQrScan` khóa scanner và chuyển chuỗi QR tới `useQrResolution`.
3. Service gọi `POST /api/v1/pois/qr/resolve` với `qr_code`, `language_code`.
4. Backend tìm POI đang `ACTIVE`, narration `PUBLISHED` có MP3 hợp lệ.
5. UI hiển thị POI, content, ngôn ngữ và link MP3; có thể mở link để kiểm thử.
6. "Quét mã QR khác" reset hook, mở camera để quét tiếp.

**Phạm vi hiện tại:** resolve audio thành công không tự phát MP3 trong ứng dụng và **không** tạo listening event. Nút mở MP3 dùng trình duyệt/ứng dụng bên ngoài. Khi xây dựng native player, chỉ gọi `POST /api/v1/listening/qr-scans` sau khi audio thực sự bắt đầu phát.

## Chạy trên điện thoại

1. Tạo file `.env` tại root project và đặt
   `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000`.
2. Thay `192.168.1.10` bằng IP LAN thực tế của máy chạy backend; điện thoại và máy tính cùng Wi-Fi.
3. Chạy backend lắng nghe trên `0.0.0.0:8000` và bảo đảm firewall cho phép truy cập.
4. Khởi động lại Expo Metro sau khi thay biến môi trường.
5. Mở tab QR Scan và hướng camera vào QR của POI.

Khi backend dev trả `audio_url` ở `http://localhost:8000`, service sẽ thay phần host bằng API Base URL chỉ trong môi trường truy cập bằng IP/host ngoài localhost. Production nên dùng URL HTTPS thật của backend/CDN.

### Kịch bản kiểm thử

- QR `HAN-VAN-MIEU` của một POI đang `ACTIVE`: trả audio published.
- QR không tồn tại: hiển thị lỗi và nút quét lại.
- Không có mạng: hiển thị lỗi, không khóa camera vĩnh viễn.
- Quét cùng QR nhiều lần khi request đang xử lý: chỉ gửi một request.
- Đóng màn hình khi request đang chạy: hủy request và không set state sau unmount.
- Mã ngôn ngữ test hiện mặc định `en`, phù hợp với nội dung Văn Miếu đã publish.
