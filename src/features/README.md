# Feature architecture

`src/features` tổ chức mã nguồn theo **nghiệp vụ** thay vì theo loại file toàn
ứng dụng. Mỗi feature sở hữu UI, state và quy tắc nghiệp vụ của chính nó. Route
trong `src/app` chỉ nên ghép màn hình và chuyển tham số cho feature.

## Cấu trúc chuẩn

Không phải feature nào cũng cần đủ mọi thư mục. Chỉ tạo thư mục khi có ít nhất
một file thực sự thuộc trách nhiệm đó.

```text
src/features/<feature>/
├── components/  # Màn hình và UI chỉ thuộc feature
├── hooks/       # State, effect và logic vòng đời React
├── constants/   # Giá trị cấu hình bất biến, asset registry
├── data/        # Fixture, mock và dữ liệu tĩnh
├── services/    # I/O: API, storage, filesystem, native service
├── types/       # Kiểu dữ liệu dùng bởi nhiều file trong feature
└── utils/       # Hàm thuần, không chứa state/effect và không render UI
```

Repo hiện còn dùng tên `datas/` ở một số feature. Tên chuẩn cho code mới nên là
`data/` vì `data` đã là danh từ không đếm được. Khi đổi tên, cần đổi toàn bộ
import trong cùng một commit để không làm hỏng build trên filesystem phân biệt
hoa thường.

## Các feature hiện tại

- `explore`: duyệt danh sách địa điểm và xem nội dung chi tiết.
- `map`: vị trí người dùng, MapLibre, camera control và danh sách POI trên map.
- `offline`: dung lượng thiết bị và các gói nội dung dùng ngoại tuyến.
- `qr-scan`: quyền camera, quét QR và animation viewfinder.
- `settings`: tùy chọn ngôn ngữ, âm thanh, giao diện và thông tin ứng dụng.
- `startup`: preload font/ảnh và giao diện splash trong React.

## Khi nào đặt file ở đâu?

### `components/`

- Chứa component hoặc screen có JSX.
- Component chỉ render và điều phối sự kiện ngắn.
- Khi component chứa nhiều state/effect, animation hoặc quy tắc lọc dữ liệu,
  chuyển phần đó sang hook.
- Style chỉ dùng cho một component tiếp tục đặt cùng file; không tách chỉ để
  giảm số dòng.

### `hooks/`

- Chứa logic dùng React hooks: permission, subscription, animation, tìm kiếm,
  tải dữ liệu hoặc state của màn hình.
- Hook không nên trả JSX.
- Effect phải cleanup subscription, timer và animation khi unmount.

### `constants/`

- Chứa giá trị không đổi như ngưỡng animation, camera config và static assets.
- Không đặt dữ liệu có thể thay đổi theo người dùng hoặc server tại đây.
- Nhóm các giá trị liên quan theo mục đích thay vì tạo một file `constants.ts`
  quá lớn.

### `data/`

- Chứa mock/fixture và dữ liệu tĩnh phục vụ phát triển.
- Dữ liệu lấy từ API, filesystem hoặc database thuộc `services/` và hooks gọi
  service đó.

### `services/`

- Bao bọc I/O và SDK bên ngoài.
- Service không render UI và không gọi React hooks.
- Giữ chi tiết của Expo/native API khỏi component khi logic bắt đầu phức tạp.

### `types/`

- Dùng khi một kiểu được chia sẻ bởi nhiều file trong cùng feature.
- Kiểu chỉ dùng một lần nên đặt cạnh component/hook sử dụng nó.
- Ưu tiên tên theo nghiệp vụ, tránh các tên chung như `Data`, `Item`, `Props`
  khi ngữ cảnh không rõ.

### `utils/`

- Chứa hàm thuần như format, normalize hoặc tính toán.
- Hàm có state/effect là hook; hàm thực hiện I/O là service.

## Có nên tạo `features/_shared`?

**Hiện tại không nên.** `_shared` thường nhanh chóng trở thành nơi gom mọi thứ
không rõ chủ sở hữu và tạo phụ thuộc vòng giữa các feature.

Áp dụng thứ tự sau khi một phần được dùng ở nhiều nơi:

1. Nếu vẫn thuộc một nghiệp vụ, chuyển nó về feature sở hữu nghiệp vụ đó.
2. Nếu là UI/logic kỹ thuật dùng toàn ứng dụng và không mang nghiệp vụ, đặt tại
   `src/components`, `src/hooks`, `src/constants` hoặc một `src/utils` chung.
3. Chỉ cân nhắc `features/_shared` khi có nhiều feature cùng dùng một module
   nghiệp vụ nhưng module đó thật sự không có domain owner. Khi đó phải ghi rõ
   public API và không cho `_shared` import ngược từ feature cụ thể.

Không chuyển code sang dùng chung chỉ vì hai đoạn trông giống nhau. Chỉ tách
khi chúng có cùng hành vi, cùng lý do thay đổi và đã có ít nhất hai nơi sử dụng.

## Hướng phụ thuộc

```text
src/app
  -> src/features/<feature>
       -> feature components/hooks/services/utils
       -> src/components, src/hooks, src/constants
       -> src/utils
```

- Feature không import route từ `src/app`.
- Tránh để hai feature UI import lẫn nhau.
- Feature dùng chung theo domain không được import ngược feature tiêu thụ nó.
- Dùng alias `@/` cho import xuyên feature; dùng relative import bên trong cùng
  feature.

## Quy ước comment

- Mỗi file có một module comment ngắn nêu trách nhiệm và ranh giới của file.
- Comment giải thích **vì sao**, lifecycle, cleanup hoặc ràng buộc nền tảng.
- Không comment lại điều tên biến/hàm đã thể hiện.
- Comment cần được cập nhật cùng code; comment sai nguy hiểm hơn thiếu comment.

## Thêm feature mới

1. Tạo `src/features/<feature>` với đúng các thư mục cần dùng.
2. Đặt screen/component chính trong `components/`.
3. Tách state/effect có trách nhiệm riêng sang `hooks/`.
4. Đặt I/O trong `services/`, hàm thuần trong `utils/` và cấu hình bất biến
   trong `constants/`.
5. Tạo route mỏng trong `src/app` để render feature screen.
6. Chỉ nâng code lên phạm vi dùng chung sau khi có nhu cầu tái sử dụng thật.
