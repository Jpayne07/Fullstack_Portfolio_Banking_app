from sqlalchemy import Column
from sqlalchemy.orm import relationship
from config import db
from sqlalchemy_serializer import SerializerMixin


class Users(db, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True)
    account_type = db.Column(db.String)
    password = db.Column(db.String)


class Transactions(db, SerializerMixin):
    __tablename__ = "transactions"
    id = db.column(db.Integer, primary_key = True)
    title = db.column(db.String)
    category = db.Column(db.String)
    created_date = db.Column(db.DateTime, default=db.datetime.datetime.utcnow)