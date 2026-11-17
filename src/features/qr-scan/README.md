# QR Scan — resolve POI audio

## Cấu trúc

- `components/QrScanScreen.tsx`: điều phối camera, loading, lỗi và chuyển sang chi tiết POI.
- `components/QrScanViewfinder.tsx`: CameraView; giữ nguyên logic scanner/animation.
- `hooks/useQrScan.ts`: xin quyền camera, khóa quét lặp và mở khóa khi quét lại.
- `hooks/useQrResolution.ts`: gọi service, quản lý request/AbortController và React state.
- `../audio/hooks/useAudioPlayback.ts`: hook phát audio dùng chung cho QR và Explore.
- `../audio/components/NarrationAudioPlayer.tsx`: UI player MP3 dùng chung, gồm loading/error, pause/resume/replay và thời gian.
- `components/QrAudioPlayer.tsx`: wrapper bổ sung listening analytics riêng cho lượt quét QR.
- `services/qr-scan.api.ts`: gửi request HTTP, kiểm tra JSON, chuẩn hóa audio URL.
- `types/qr-scan.types.ts`: request/response từ backend và type cho UI.

## Luồng

1. Camera đọc nội dung QR, ví dụ `HAN-VAN-MIEU`.
2. `useQrScan` khóa scanner và chuyển chuỗi QR tới `useQrResolution`.
3. Service gọi `POST /api/v1/pois/qr/resolve` với `qr_code`, `language_code`.
4. Backend tìm POI đang `ACTIVE`, narration `PUBLISHED` có MP3 hợp lệ.
5. App chuyển sang trang chi tiết POI và truyền mã QR làm nguồn điều hướng.
6. Trang chi tiết tải narration đã publish và player tự phát sau khi tải thành công.
7. Khi quay lại tab QR, scanner đã được reset để sẵn sàng quét mã tiếp theo.

**Listening analytics:** Khi player xác nhận `status.playing`, app gửi `POST /api/v1/listening/qr-scans` với ID sự kiện `listen-ddmmyy-xxxxxxxx`, `installation_id` được lưu trên thiết bị, mã QR và `poi_content_id` đã resolve. Một lượt QR tạo một listening session; tạm dừng/tiếp tục không tạo lượt mới, còn bấm "Phát lại" sẽ tạo một phiên mới. Việc ghi thất bại chỉ cảnh báo trong Metro, không ngắt audio; chưa có offline retry queue. Dashboard đọc tổng lượt nghe từ database, nên cần làm mới trang Dashboard để thấy giá trị mới.

## Chạy trên điện thoại

1. Tạo file `.env` tại root project và đặt
   `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000`, hoặc nhập địa chỉ
   laptop tại **Settings > API Settings for Demo**. Địa chỉ lưu trong Settings
   được ưu tiên hơn biến môi trường và vẫn còn sau khi mở lại ứng dụng.
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
