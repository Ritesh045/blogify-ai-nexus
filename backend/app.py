
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to MongoDB - update this with your MongoDB connection string
mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/ai_blog")
client = MongoClient(mongo_uri)
db = client.get_database()

# Collections
users = db.users
posts = db.posts
comments = db.comments

# Helper function to serialize ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super().default(obj)

app.json_encoder = JSONEncoder

# Authentication routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users.find_one({'email': email})
    
    # Simple password check (use proper hashing in production)
    if user and password == user.get('password'):
        return jsonify({
            'id': str(user['_id']),
            'name': user.get('name'),
            'email': user.get('email')
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # Check if user already exists
    if users.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400
    
    # Create new user (use password hashing in production)
    user_id = users.insert_one({
        'name': name, 
        'email': email, 
        'password': password,
        'created_at': datetime.datetime.utcnow()
    }).inserted_id
    
    return jsonify({
        'id': str(user_id),
        'name': name,
        'email': email
    })

# Blog post routes
@app.route('/api/posts', methods=['GET'])
def get_posts():
    all_posts = list(posts.find().sort('createdAt', -1))
    return jsonify(all_posts)

@app.route('/api/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    post = posts.find_one({'_id': ObjectId(post_id)})
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    return jsonify(post)

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    post_data = {
        'title': data.get('title'),
        'content': data.get('content'),
        'excerpt': data.get('excerpt'),
        'coverImage': data.get('coverImage'),
        'authorId': data.get('authorId'),
        'authorName': data.get('authorName'),
        'createdAt': datetime.datetime.utcnow(),
        'tags': data.get('tags', []),
        'likes': 0,
        'comments': []
    }
    
    post_id = posts.insert_one(post_data).inserted_id
    post_data['_id'] = str(post_id)
    
    return jsonify(post_data)

@app.route('/api/posts/<post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.json
    update_data = {k: v for k, v in data.items() if k != '_id'}
    
    result = posts.update_one(
        {'_id': ObjectId(post_id)}, 
        {'$set': update_data}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Post not found'}), 404
    
    updated_post = posts.find_one({'_id': ObjectId(post_id)})
    return jsonify(updated_post)

@app.route('/api/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    result = posts.delete_one({'_id': ObjectId(post_id)})
    
    if result.deleted_count == 0:
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify({'message': 'Post deleted successfully'})

@app.route('/api/posts/<post_id>/like', methods=['POST'])
def like_post(post_id):
    result = posts.update_one(
        {'_id': ObjectId(post_id)},
        {'$inc': {'likes': 1}}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Post not found'}), 404
    
    updated_post = posts.find_one({'_id': ObjectId(post_id)})
    return jsonify({'likes': updated_post['likes']})

# Comment routes
@app.route('/api/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    data = request.json
    
    # Simple spam detection (contains URLs or specific spam keywords)
    spam_keywords = ["viagra", "casino", "lottery", "winner", "free money"]
    content = data.get('content', '').lower()
    
    has_spam_keywords = any(keyword in content for keyword in spam_keywords)
    url_count = content.count('http')
    is_spam = has_spam_keywords or url_count > 2
    
    comment = {
        '_id': ObjectId(),
        'content': data.get('content'),
        'authorId': data.get('authorId'),
        'authorName': data.get('authorName'),
        'createdAt': datetime.datetime.utcnow(),
        'isSpam': is_spam
    }
    
    result = posts.update_one(
        {'_id': ObjectId(post_id)},
        {'$push': {'comments': comment}}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify({
        **comment,
        '_id': str(comment['_id'])
    })

@app.route('/api/posts/<post_id>/comments/<comment_id>', methods=['DELETE'])
def delete_comment(post_id, comment_id):
    result = posts.update_one(
        {'_id': ObjectId(post_id)},
        {'$pull': {'comments': {'_id': ObjectId(comment_id)}}}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Post or comment not found'}), 404
    
    return jsonify({'message': 'Comment deleted successfully'})

# AI content suggestions
@app.route('/api/ai/suggestions', methods=['POST'])
def get_content_suggestion():
    data = request.json
    suggestion_type = data.get('type')
    prompt = data.get('prompt', '')
    
    # Mock AI suggestions based on type and prompt
    # In a real app, this would call a machine learning model or API
    suggestion = ''
    
    if suggestion_type == 'title':
        suggestion = f"{prompt}: A New Perspective" if prompt else "The Future of AI in Content Creation"
    elif suggestion_type == 'content':
        suggestion = f"Here's an introduction for your topic on {prompt}" if prompt else "Artificial Intelligence is revolutionizing how we create and consume digital content."
    elif suggestion_type == 'improvement':
        suggestion = f"To enhance your content on {prompt}, consider adding specific examples" if prompt else "Consider adding more specific examples to illustrate your points."
    
    return jsonify({
        'type': suggestion_type,
        'suggestion': suggestion,
        'used': False
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
