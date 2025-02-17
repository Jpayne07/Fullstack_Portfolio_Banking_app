from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
import os
from dotenv import load_dotenv
from flask_cors import CORS
from datetime import timedelta
from flask_session import Session



load_dotenv()
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get('APP_SECRET_KEY')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

# Set session configuration
app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

# Tell Flask-Session to use your existing SQLAlchemy db instance

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_URL = "https://api.github.com/user"
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
metadata_obj = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata_obj)
db.init_app(app)

# Configure Flask-Session to use the SQLAlchemy instance
app.config['SESSION_SQLALCHEMY'] = db
Session(app)  # Call Session(app) only once

# Continue with the rest of your configuration
bcrypt = Bcrypt(app)
api = Api(app)
migrate = Migrate(app, db)