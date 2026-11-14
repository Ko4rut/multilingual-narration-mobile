# QR Scan — resolve POI audio

## Cấu trúc

- `components/QrScanScreen.tsx`: điều phối camera, loading, lỗi và kết quả.
- `components/QrScanViewfinder.tsx`: CameraView; giữ nguyên logic scanner/animation.
- `components/QrNarrationResult.tsx`: hiển thị POI/audio và render player native.
- `hooks/useQrScan.ts`: xin quyền camera, khóa quét lặp và mở khóa khi quét lại.
- `hooks/useQrResolution.ts`: gọi service, quản lý request/AbortController và React state.
- `hooks/useQrAudioPlayback.ts`: tự phát khi MP3 load xong; pause/resume/replay và xử lý khi đổi tab.
- `components/QrAudioPlayer.tsx`: điều khiển player MP3 native, trạng thái loading/error và thời gian.
- `services/qr-scan.api.ts`: gửi request HTTP, kiểm tra JSON, chuẩn hóa audio URL.
- `types/qr-scan.types.ts`: request/response từ backend và type cho UI.

## Luồng

1. Camera đọc nội dung QR, ví dụ `HAN-VAN-MIEU`.
2. `useQrScan` khóa scanner và chuyển chuỗi QR tới `useQrResolution`.
3. Service gọi `POST /api/v1/pois/qr/resolve` với `qr_code`, `language_code`.
4. Backend tìm POI đang `ACTIVE`, narration `PUBLISHED` có MP3 hợp lệ.
5. UI hiển thị POI, content, ngôn ngữ và trình phát MP3 nội bộ. Player tự phát sau khi tải thành công.
6. "Quét mã QR khác" reset hook, mở camera để quét tiếp.

**Phạm vi hiện tại:** tự phát MP3 trong ứng dụng khi QR hợp lệ, nhưng **chưa** tạo listening event. Chỉ gọi `POST /api/v1/listening/qr-scans` khi player báo audio thực sự bắt đầu phát; tránh tính lượt nghe khi chưa mở được MP3.

## Chạy trên điện thoại

1. Tạo file `.env` tại root project và đặt
   `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000`.
2. Thay `192.168.1.10` bằng IP LAN thực tế của máy chạy backend; điện thoại và máy tính cùng Wi-Fi.
3. Chạy backend lắng nghe trên `0.0.0.0:8000` và bảo đảm firewall cho phép truy cập.
4. Khởi động lại Expo Metro sau khi thay biến môi trường.
5. Cài dependencies bằng `npm ci`, rebuild Android/iOS development client vì `expo-audio` có native module, sau đó mở tab QR Scan và hướng camera vào QR của POI.
6. Trên thiết bị thật, bảo đảm `audio_url` sau normalize truy cập được qua IP LAN hoặc HTTPS; không dùng `localhost`.

Khi backend dev trả `audio_url` ở `http://localhost:8000`, service sẽ thay phần host bằng API Base URL chỉ trong môi trường truy cập bằng IP/host ngoài localhost. Production nên dùng URL HTTPS thật của backend/CDN.

### Kịch bản kiểm thử

- QR `HAN-VAN-MIEU` của một POI đang `ACTIVE`: trả audio published.
- QR không tồn tại: hiển thị lỗi và nút quét lại.
- Không có mạng: hiển thị lỗi, không khóa camera vĩnh viễn.
- Quét cùng QR nhiều lần khi request đang xử lý: chỉ gửi một request.
- Đóng màn hình khi request đang chạy: hủy request và không set state sau unmount.
- Mã ngôn ngữ test hiện mặc định `en`, phù hợp với nội dung Văn Miếu đã publish.
