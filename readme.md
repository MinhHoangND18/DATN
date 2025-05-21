# Hệ Thống Gợi Ý Sản Phẩm

Hệ thống gợi ý sản phẩm thông minh sử dụng kết hợp nhiều phương pháp để đưa ra các đề xuất phù hợp nhất cho người dùng.

## Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cấu Trúc Dữ Liệu](#cấu-trúc-dữ-liệu)
3. [Các Phương Pháp Gợi Ý](#các-phương-pháp-gợi-ý)
4. [API Endpoints](#api-endpoints)
5. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)
6. [Giải Thích Chi Tiết Code](#giải-thích-chi-tiết-code)

## Tổng Quan

Hệ thống sử dụng 3 phương pháp chính để đưa ra gợi ý:

- User-based Collaborative Filtering
- Item-based Collaborative Filtering
- Hybrid Recommendation (Kết hợp)

### Các tính năng chính:

- Phân tích hành vi người dùng (xem, thêm giỏ hàng, mua)
- Tính toán độ tương đồng giữa người dùng và sản phẩm
- Lọc theo khoảng giá và danh mục
- Điều chỉnh gợi ý theo thông tin nhân khẩu học

## Cấu Trúc Dữ Liệu

### 1. Users Dataset (users.csv)

```csv
user_id,age,gender,location
1,25,Nam,HN
2,30,Nữ,HCM
```

### 2. Products Dataset (products.csv)

```csv
product_id,category,price
1,Fashion,299000
2,Sport,499000
```

### 3. Behavior Dataset (behavior_data.csv)

```csv
user_id,product_id,views,cart_adds,purchases
1,1,5,2,1
1,2,3,0,0
```

## Các Phương Pháp Gợi Ý

### 1. Tính Điểm Quan Tâm

```python
interest_score = 0.3 * views + 0.4 * cart_adds + 0.3 * purchases
```

Ví dụ:

- User xem sản phẩm 5 lần (5 \* 0.3 = 1.5)
- Thêm vào giỏ 2 lần (2 \* 0.4 = 0.8)
- Mua 1 lần (1 \* 0.3 = 0.3)
- Tổng điểm: 2.6

### 2. User-based Collaborative Filtering

Quy trình:

1. Tìm người dùng tương tự
2. Lấy sản phẩm từ người dùng tương tự
3. Tính điểm dựa trên:
   - Mức độ tương đồng của người dùng
   - Danh mục ưa thích
   - Khoảng giá phù hợp
   - Thông tin nhân khẩu học

Ví dụ:

```python
# Tìm 5 người dùng tương tự nhất
similar_users = [
    (user_id=2, similarity=0.8),
    (user_id=5, similarity=0.7),
    ...
]

# Tính điểm sản phẩm
score = interest_score + category_boost - price_penalty + demographic_score
```

### 3. Item-based Collaborative Filtering

Quy trình:

1. Tính độ tương đồng giữa các sản phẩm
2. Từ sản phẩm đã tương tác, tìm sản phẩm tương tự
3. Điều chỉnh điểm dựa trên:
   - Mức độ tương đồng sản phẩm
   - Danh mục sản phẩm
   - Khoảng giá
   - Đặc điểm người dùng

## API Endpoints

### GET /recommend

Parameters:

- `user_id` (required): ID người dùng
- `num_recommendations` (optional): Số lượng gợi ý (default: 10)
- `method` (optional): Phương pháp gợi ý ('user', 'item', 'hybrid')
- `max_price` (optional): Giá tối đa
- `category` (optional): Danh mục sản phẩm
- `age` (optional): Tuổi người dùng
- `gender` (optional): Giới tính
- `location` (optional): Vị trí

Response:

```json
{
  "user_id": 1,
  "product_ids": [5, 2, 8, 1, 9]
}
```

## Ví Dụ Sử Dụng

### 1. Gợi ý cơ bản

```bash
curl "http://localhost:5000/recommend?user_id=1"
```

### 2. Gợi ý với bộ lọc

```bash
curl "http://localhost:5000/recommend?user_id=1&method=hybrid&max_price=500000&category=Fashion"
```

### 3. Gợi ý với thông tin người dùng

```bash
curl "http://localhost:5000/recommend?user_id=1&age=25&gender=Nam&location=HN"
```

## Giải Thích Chi Tiết Code

### 1. Khởi tạo và Cấu hình

```python
# Cấu hình logging để theo dõi quá trình hoạt động
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Định nghĩa đường dẫn dữ liệu
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'data'))
```

### 2. Load và Kiểm Tra Dữ Liệu

```python
def load_data():
    """
    Hàm này thực hiện:
    1. Đọc 3 file CSV: users, products, behavior
    2. Kiểm tra các cột bắt buộc có tồn tại không
    3. Xử lý lỗi khi file không tồn tại hoặc rỗng
    """
    try:
        users = pd.read_csv(users_path)
        required_user_cols = ['user_id', 'age', 'gender', 'location']
        # Kiểm tra cột bắt buộc
        missing_user_cols = [col for col in required_user_cols if col not in users.columns]
        if missing_user_cols:
            raise ValueError(f"Missing required columns in users.csv: {missing_user_cols}")
        ...
```

### 3. Xử Lý Dữ Liệu Người Dùng

```python
# Tính điểm quan tâm dựa trên hành vi người dùng
behavior['interest_score'] = (
    0.3 * behavior['views'] +     # Trọng số cho lượt xem
    0.4 * behavior['cart_adds'] + # Trọng số cho thêm vào giỏ
    0.3 * behavior['purchases']   # Trọng số cho lượt mua
)

# Tạo ma trận user-product
user_product_matrix = behavior.pivot_table(
    index='user_id',      # Mỗi hàng là một user
    columns='product_id', # Mỗi cột là một sản phẩm
    values='interest_score'
).fillna(0)  # Điền 0 cho các giá trị NaN
```

### 4. Chuẩn Hóa Dữ Liệu

```python
# Chuẩn hóa ma trận để các giá trị có cùng thang đo
scaler = StandardScaler()
normalized_matrix = pd.DataFrame(
    scaler.fit_transform(user_product_matrix),
    index=user_product_matrix.index,
    columns=user_product_matrix.columns
)
```

### 5. Tính Toán Độ Tương Đồng

```python
def calculate_cosine_similarity(user_vector, other_users):
    """
    Tính độ tương đồng cosine giữa một user và các user khác

    Công thức: similarity = 1 - cosine(vector1, vector2)
    - Giá trị càng gần 1: càng giống nhau
    - Giá trị càng gần 0: càng khác nhau
    """
    similarities = {}
    for user_id, vector in other_users.iterrows():
        # Chỉ tính trên các sản phẩm mà cả 2 user đều có tương tác
        mask = (user_vector != 0) & (vector != 0)
        if mask.any():
            similarity = 1 - cosine(user_vector[mask], vector[mask])
            similarities[user_id] = similarity
    return similarities
```

### 6. Xác Định Sở Thích Người Dùng

```python
def get_category_preference(user_id):
    """
    Tìm danh mục ưa thích của người dùng:
    1. Lấy tất cả sản phẩm user đã tương tác
    2. Tính tổng điểm quan tâm theo từng danh mục
    3. Chọn danh mục có điểm cao nhất
    """
    user_behavior = behavior[behavior['user_id'] == user_id].merge(
        products[['product_id', 'category']],
        on='product_id'
    )
    category_scores = user_behavior.groupby('category')['interest_score'].sum()
    return category_scores.idxmax() if not category_scores.empty else None
```

### 7. Điểm Phù Hợp Nhân Khẩu Học

```python
def get_demographic_score(user_id, product_id):
    """
    Tính điểm phù hợp dựa trên:
    - Tuổi: +0.2 nếu phù hợp với độ tuổi
    - Giới tính: +0.2 nếu phù hợp với giới tính
    - Vị trí: +0.2 nếu phù hợp với vị trí
    """
    score = 0
    user = users[users['user_id'] == user_id].iloc[0]
    product = products[products['product_id'] == product_id].iloc[0]

    # Điểm theo độ tuổi
    if user['age'] < 30 and product['category'] in ['Fashion', 'Sport']:
        score += 0.2
    elif user['age'] >= 30 and product['category'] in ['Formal', 'Medical']:
        score += 0.2

    # Điểm theo giới tính và các tiêu chí khác...
    return score
```

### 8. Gợi Ý Dựa Trên Sản Phẩm (Item-based)

```python
def get_item_based_recommendations(user_id, num_recommendations=10):
    """
    Quy trình gợi ý:
    1. Tính ma trận tương đồng giữa các sản phẩm
    2. Với mỗi sản phẩm user đã tương tác:
       - Tìm các sản phẩm tương tự
       - Tính điểm dựa trên độ tương đồng
    3. Điều chỉnh điểm theo:
       - Danh mục ưa thích (+0.3)
       - Khoảng giá phù hợp (-0.5 nếu ngoài khoảng)
       - Điểm nhân khẩu học
    """
    item_matrix = normalized_matrix.T
    item_similarities = pd.DataFrame(
        cosine_similarity(item_matrix.values),
        index=item_matrix.index,
        columns=item_matrix.index
    )
    # Tính toán điểm và sắp xếp...
```

### 9. API Endpoint

```python
@app.route('/recommend', methods=['GET'])
def get_recommendation():
    """
    API endpoint xử lý:
    1. Lấy tham số từ request
    2. Kiểm tra và xử lý user_id
    3. Cập nhật thông tin người dùng tạm thời
    4. Gọi phương pháp gợi ý phù hợp
    5. Lọc kết quả theo giá và danh mục
    6. Trả về danh sách sản phẩm gợi ý
    """
    try:
        user_id = request.args.get('user_id', type=int)
        # Xử lý các tham số khác...

        if method == 'user':
            recommendations = get_user_based_recommendations(...)
        elif method == 'item':
            recommendations = get_item_based_recommendations(...)
        else:
            recommendations = get_hybrid_recommendations(...)

        return jsonify({
            'user_id': user_id,
            'product_ids': recommendations
        })
    except Exception as e:
        logger.error(f"Error in recommendation API: {e}")
        return jsonify({'error': str(e)}), 500
```

### 10. Cache và Tối Ưu

```python
@lru_cache(maxsize=1000)
def get_user_similarities(user_id):
    """
    Sử dụng cache để lưu kết quả tính toán:
    - Giảm thời gian xử lý cho các request lặp lại
    - Giới hạn 1000 kết quả trong cache
    - Tự động xóa các kết quả cũ khi cache đầy
    """
    try:
        user_vector = normalized_matrix.loc[user_id]
        similarities = calculate_cosine_similarity(user_vector, normalized_matrix)
        return similarities
    except KeyError:
        logger.warning(f"User {user_id} not found in normalized matrix")
        return {}
```

### 11. Công Thức Tính Điểm Chi Tiết

Hệ thống sử dụng nhiều thành phần để tính điểm cuối cùng cho mỗi sản phẩm:

1. **Điểm Cơ Bản** (Base Score):

   ```python
   base_score = similarity_score * interest_score
   ```

   - `similarity_score`: Độ tương đồng (0-1)
   - `interest_score`: Điểm quan tâm từ hành vi

2. **Điểm Danh Mục** (Category Score):

   ```python
   category_score = 0.3 if product.category == user.preferred_category else 0
   ```

3. **Điểm Nhân Khẩu Học** (Demographic Score):

   ```python
   demographic_score = 0
   # Tuổi
   if user.age < 30 and product.category in ['Fashion', 'Sport']:
       demographic_score += 0.2
   # Giới tính
   if user.gender == 'Nam' and product.category in ['Men', 'Sport']:
       demographic_score += 0.2
   # Vị trí
   if user.location == 'Cold' and product.category == 'Warm':
       demographic_score += 0.2
   ```

4. **Phạt Giá** (Price Penalty):

   ```python
   price_range = get_price_range(user_id)  # (min, max)
   price_penalty = 0.5 if product.price not in price_range else 0
   ```

5. **Điểm Cuối Cùng** (Final Score):
   ```python
   final_score = base_score + category_score + demographic_score - price_penalty
   ```

Ví dụ cụ thể:

- Base Score: 0.8 (độ tương đồng cao)
- Category Score: 0.3 (khớp danh mục ưa thích)
- Demographic Score: 0.4 (khớp tuổi và giới tính)
- Price Penalty: 0 (giá phù hợp)
- Final Score: 0.8 + 0.3 + 0.4 - 0 = 1.5
