from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import os
from typing import List, Optional, Dict
import logging
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import cosine
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Định nghĩa đường dẫn dữ liệu
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'data'))
users_path = os.path.join(DATA_DIR, 'users.csv')
products_path = os.path.join(DATA_DIR, 'products.csv')
behavior_path = os.path.join(DATA_DIR, 'behavior_data.csv')

app = Flask(__name__)

def load_data() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Tải dữ liệu từ các file CSV và kiểm tra tính hợp lệ."""
    try:
        # Tải users.csv
        users = pd.read_csv(users_path)
        required_user_cols = ['user_id', 'age', 'gender', 'location']
        missing_user_cols = [col for col in required_user_cols if col not in users.columns]
        if missing_user_cols:
            raise ValueError(f"Missing required columns in users.csv: {missing_user_cols}")
        
        # Tải products.csv
        products = pd.read_csv(products_path)
        required_product_cols = ['product_id', 'category', 'price']
        missing_product_cols = [col for col in required_product_cols if col not in products.columns]
        if missing_product_cols:
            raise ValueError(f"Missing required columns in products.csv: {missing_product_cols}")
        # Chỉ giữ các cột cần thiết
        products = products[['product_id', 'category', 'price']]
        
        # Tải behavior_data.csv
        behavior = pd.read_csv(behavior_path)
        required_behavior_cols = ['user_id', 'product_id', 'views', 'cart_adds', 'purchases']
        missing_behavior_cols = [col for col in required_behavior_cols if col not in behavior.columns]
        if missing_behavior_cols:
            raise ValueError(f"Missing required columns in behavior_data.csv: {missing_behavior_cols}")
        
        return users, products, behavior
    except FileNotFoundError as e:
        logger.error(f"Data file not found: {e}")
        raise
    except pd.errors.EmptyDataError:
        logger.error("One or more data files are empty")
        raise
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        raise

# Tải dữ liệu
try:
    users, products, behavior = load_data()
    logger.info("Data loaded successfully")
except Exception as e:
    logger.error(f"Failed to load data: {e}")
    raise

# Tính điểm quan tâm của người dùng với sản phẩm
behavior['interest_score'] = (
    0.3 * behavior['views'] +
    0.4 * behavior['cart_adds'] +
    0.3 * behavior['purchases']
)

# Tạo ma trận user-product
user_product_matrix = behavior.pivot_table(
    index='user_id', 
    columns='product_id', 
    values='interest_score'
).fillna(0)

# Chuẩn hóa ma trận user-product
scaler = StandardScaler()
normalized_matrix = pd.DataFrame(
    scaler.fit_transform(user_product_matrix),
    index=user_product_matrix.index,
    columns=user_product_matrix.columns
)

def calculate_cosine_similarity(user_vector: pd.Series, other_users: pd.DataFrame) -> Dict[int, float]:
    """Tính cosine similarity giữa một user vector và các user khác."""
    similarities = {}
    for user_id, vector in other_users.iterrows():
        mask = (user_vector != 0) & (vector != 0)
        if mask.any():
            similarity = 1 - cosine(user_vector[mask], vector[mask])
            similarities[user_id] = similarity
    return similarities

@lru_cache(maxsize=1000)
def get_user_similarities(user_id: int) -> Dict[int, float]:
    """Lấy similarities của một user với cache."""
    try:
        user_vector = normalized_matrix.loc[user_id]
        similarities = calculate_cosine_similarity(user_vector, normalized_matrix)
        return similarities
    except KeyError:
        logger.warning(f"User {user_id} not found in normalized matrix")
        return {}

def get_category_preference(user_id: int) -> Optional[str]:
    """Tìm danh mục ưa thích của người dùng dựa trên interest_score."""
    user_behavior = behavior[behavior['user_id'] == user_id].merge(
        products[['product_id', 'category']], on='product_id'
    )
    category_scores = user_behavior.groupby('category')['interest_score'].sum()
    return category_scores.idxmax() if not category_scores.empty else None

def get_demographic_score(user_id: int, product_id: int) -> float:
    """Tính điểm phù hợp dựa trên tuổi, giới tính, vị trí."""
    if user_id not in users['user_id'].values or product_id not in products['product_id'].values:
        logger.warning(f"Invalid user_id {user_id} or product_id {product_id}")
        return 0
    
    user = users[users['user_id'] == user_id].iloc[0]
    product = products[products['product_id'] == product_id].iloc[0]
    
    score = 0
    # Tuổi
    if user['age'] < 30 and product['category'] in ['Fashion', 'Sport']:
        score += 0.2
    elif user['age'] >= 30 and product['category'] in ['Formal', 'Medical']:
        score += 0.2
    
    # Giới tính
    if user['gender'] == 'Nam' and product['category'] in ['Men', 'Sport']:
        score += 0.2
    elif user['gender'] == 'Nữ' and product['category'] in ['Women', 'Fashion']:
        score += 0.2
    
    # Vị trí
    if user['location'] == 'Cold' and product['category'] == 'Warm':
        score += 0.2
    elif user['location'] == 'Hot' and product['category'] == 'Breathable':
        score += 0.2
    
    return score

def get_price_range(user_id: int) -> tuple[float, float]:
    """Tính khoảng giá phù hợp dựa trên lịch sử tương tác."""
    user_products = behavior[behavior['user_id'] == user_id]['product_id']
    if user_products.empty:
        return (0, float('inf'))
    avg_price = products[products['product_id'].isin(user_products)]['price'].mean()
    return (avg_price * 0.8, avg_price * 1.2)  # ±20%

def get_item_based_recommendations(user_id: int, num_recommendations: int = 10) -> List[int]:
    """Lấy recommendations dựa trên item-based collaborative filtering."""
    if user_id not in normalized_matrix.index:
        logger.info(f"User {user_id} not found, returning popular products")
        popular_products = behavior.groupby('product_id')['purchases'].sum().sort_values(ascending=False).index
        return [int(pid) for pid in popular_products[:num_recommendations]]  # Chuyển int64 thành int
    
    item_matrix = normalized_matrix.T
    item_similarities = pd.DataFrame(
        cosine_similarity(item_matrix.values),
        index=item_matrix.index,
        columns=item_matrix.index
    )
    
    user_items = normalized_matrix.loc[user_id]
    interacted_items = user_items[user_items > 0].index
    
    preferred_category = get_category_preference(user_id)
    price_range = get_price_range(user_id)
    
    predictions = {}
    for item_id in item_matrix.index:
        if item_id not in interacted_items:
            score = 0
            for interacted_item in interacted_items:
                score += user_items[interacted_item] * item_similarities.loc[item_id, interacted_item]
            
            # Tăng điểm dựa trên danh mục và giá
            item_category = products[products['product_id'] == item_id]['category'].iloc[0]
            item_price = products[products['product_id'] == item_id]['price'].iloc[0]
            category_boost = 0.3 if preferred_category and item_category == preferred_category else 0
            price_penalty = 0 if price_range[0] <= item_price <= price_range[1] else 0.5
            demographic_score = get_demographic_score(user_id, item_id)
            
            predictions[item_id] = score + category_boost - price_penalty + demographic_score
    
    recommendations = sorted(predictions.items(), key=lambda x: x[1], reverse=True)
    return [int(item_id) for item_id, _ in recommendations[:num_recommendations]]  # Chuyển int64 thành int

def get_user_based_recommendations(user_id: int, num_recommendations: int = 10) -> List[int]:
    """Lấy recommendations dựa trên user-based collaborative filtering."""
    if user_id not in normalized_matrix.index:
        logger.info(f"User {user_id} not found, returning popular products")
        popular_products = behavior.groupby('product_id')['purchases'].sum().sort_values(ascending=False).index
        return [int(pid) for pid in popular_products[:num_recommendations]]  # Chuyển int64 thành int

    user_products = set(behavior[behavior['user_id'] == user_id]['product_id'])
    similarities = get_user_similarities(user_id)
    similar_users = sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:5]
    similar_user_ids = [user_id for user_id, _ in similar_users]
    
    preferred_category = get_category_preference(user_id)
    price_range = get_price_range(user_id)
    
    similar_users_products = behavior[
        (behavior['user_id'].isin(similar_user_ids)) & 
        (~behavior['product_id'].isin(user_products))
    ]
    
    recommendations = {}
    for _, row in similar_users_products.iterrows():
        product_id = row['product_id']
        item_category = products[products['product_id'] == product_id]['category'].iloc[0]
        item_price = products[products['product_id'] == product_id]['price'].iloc[0]
        
        category_boost = 0.3 if preferred_category and item_category == preferred_category else 0
        price_penalty = 0 if price_range[0] <= item_price <= price_range[1] else 0.5
        demographic_score = get_demographic_score(user_id, product_id)
        
        score = row['interest_score'] + category_boost - price_penalty + demographic_score
        recommendations[product_id] = recommendations.get(product_id, 0) + score
    
    sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
    return [int(item_id) for item_id, _ in sorted_recs[:num_recommendations]]  # Chuyển int64 thành int

def get_hybrid_recommendations(user_id: int, num_recommendations: int = 10) -> List[int]:
    """Kết hợp user-based và item-based recommendations."""
    user_based = get_user_based_recommendations(user_id, num_recommendations * 2)
    item_based = get_item_based_recommendations(user_id, num_recommendations * 2)
    
    preferred_category = get_category_preference(user_id)
    price_range = get_price_range(user_id)
    
    hybrid_recs = list(set(user_based + item_based))
    scores = {}
    for item_id in hybrid_recs:
        user_score = 1 if item_id in user_based else 0
        item_score = 1 if item_id in item_based else 0
        item_category = products[products['product_id'] == item_id]['category'].iloc[0]
        item_price = products[products['product_id'] == item_id]['price'].iloc[0]
        
        category_boost = 0.3 if preferred_category and item_category == preferred_category else 0
        price_penalty = 0 if price_range[0] <= item_price <= price_range[1] else 0.5
        demographic_score = get_demographic_score(user_id, item_id)
        
        scores[item_id] = (0.4 * user_score + 0.4 * item_score + 
                         0.2 * demographic_score + category_boost - price_penalty)
    
    sorted_recs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [int(item_id) for item_id, _ in sorted_recs[:num_recommendations]]  # Chuyển int64 thành int

@app.route('/recommend', methods=['GET'])
def get_recommendation():
    """API endpoint cho recommendations."""
    global users  # Khai báo global ngay đầu hàm
    try:
        user_id = request.args.get('user_id', type=int)
        num_recommendations = request.args.get('num_recommendations', 10, type=int)
        method = request.args.get('method', 'hybrid')
        max_price = request.args.get('max_price', type=float)
        category = request.args.get('category', type=str)
        age = request.args.get('age', type=int)
        gender = request.args.get('gender', type=str)
        location = request.args.get('location', type=str)
        
        if user_id is None:
            return jsonify({'error': 'Missing user_id'}), 400
            
        # Cập nhật thông tin người dùng tạm thời nếu được cung cấp
        if any([age, gender, location]):
            temp_user = {
                'user_id': user_id,
                'age': age if age is not None else (users[users['user_id'] == user_id]['age'].iloc[0] if user_id in users['user_id'].values else 30),
                'gender': gender if gender is not None else (users[users['user_id'] == user_id]['gender'].iloc[0] if user_id in users['user_id'].values else 'Unknown'),
                'location': location if location is not None else (users[users['user_id'] == user_id]['location'].iloc[0] if user_id in users['user_id'].values else 'Unknown')
            }
            users_new = users[users['user_id'] != user_id]
            users = pd.concat([users_new, pd.DataFrame([temp_user])], ignore_index=True)
        
        if method == 'user':
            recommendations = get_user_based_recommendations(user_id, num_recommendations)
        elif method == 'item':
            recommendations = get_item_based_recommendations(user_id, num_recommendations)
        else:
            recommendations = get_hybrid_recommendations(user_id, num_recommendations)
        
        # Lọc theo max_price và category nếu có
        if max_price is not None:
            recommendations = [pid for pid in recommendations if products[products['product_id'] == pid]['price'].iloc[0] <= max_price]
        if category:
            recommendations = [pid for pid in recommendations if products[products['product_id'] == pid]['category'].iloc[0] == category]
        
        # Chuyển price_range thành tuple Python để JSON serializable
        price_range = get_price_range(user_id)
        price_range = (float(price_range[0]), float(price_range[1])) if not np.isnan(price_range[0]) else (0.0, float('inf'))
        
        return jsonify({
            'user_id': user_id,
            'product_ids': recommendations[:num_recommendations],
            # 'num_recommendations': len(recommendations[:num_recommendations]),
            # 'method': method,
            # 'preferred_category': get_category_preference(user_id),
            # 'price_range': price_range
        })
    except Exception as e:
        logger.error(f"Error in recommendation API: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)