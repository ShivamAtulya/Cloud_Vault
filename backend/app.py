from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from pathlib import Path
from flask import send_from_directory
from werkzeug.utils import secure_filename

from models import db, User, File


app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"

STORAGE_DIR.mkdir(parents=True, exist_ok=True)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///cloudvault.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return jsonify({
        "message": "CloudVault backend is running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok"
    })


@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "Email already registered"
        }), 409

    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


@app.route("/api/files/upload", methods=["POST"])
def upload_file():
    # Temporary local-development identity.
    # Replace with verified authentication before production.
    user_id = request.form.get("user_id", type=int)

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"message": "Invalid user"}), 404

    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400

    uploaded_file = request.files["file"]

    if not uploaded_file.filename:
        return jsonify({"message": "Please select a file"}), 400

    original_name = secure_filename(uploaded_file.filename)

    if not original_name:
        return jsonify({"message": "Invalid filename"}), 400

    # Generate a unique stored name to avoid overwriting files.
    extension = Path(original_name).suffix
    stored_name = f"{uuid.uuid4().hex}{extension}"
    file_path = STORAGE_DIR / stored_name

    try:
        uploaded_file.save(str(file_path))

        file_size = file_path.stat().st_size

        new_file = File(
            user_id=user.id,
            filename=original_name,
            stored_filename=stored_name,
            filepath=str(file_path),
            file_size=file_size,
            file_type=uploaded_file.mimetype
        )

        db.session.add(new_file)
        db.session.commit()

        return jsonify({
            "message": "File uploaded successfully",
            "file": {
                "id": new_file.id,
                "filename": new_file.filename,
                "file_size": new_file.file_size,
                "file_type": new_file.file_type
            }
        }), 201

    except Exception:
        db.session.rollback()

        if file_path.exists():
            file_path.unlink()

        app.logger.exception("File upload failed")
        return jsonify({"message": "File upload failed"}), 500

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if not check_password_hash(user.password, password):
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200

if __name__ == "__main__":
    app.run(debug=True)