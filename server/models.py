from sqlalchemy import Column
from sqlalchemy.orm import relationship
from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.types import DateTime
from datetime import datetime

class Users(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True)
    account_type = db.Column(db.String)
    password = db.Column(db.String)

    transactions = association_proxy('accounts','transactions',
        creator=lambda transaction_obj: Accounts(transactions = transaction_obj))
        
    bank = association_proxy('accounts', 'banks',
            creator = lambda bank_obj: Bank(bank = bank_obj))
    
    accounts = db.relationship('Accounts', back_populates = 'users')
    serialize_rules = ('-accounts','-bank','-transactions')



class Transactions(db.Model, SerializerMixin):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    category = db.Column(db.String)
    created_at = Column(DateTime, default=datetime.utcnow)


    user = association_proxy('accounts', 'users',
        creator=lambda user_obj: Users(user = user_obj))
    
    bank = association_proxy('accounts', 'banks',
            creator=lambda bank_obj: Bank(bank = bank_obj))

    accounts = db.relationship('Accounts', back_populates = 'transactions')
    serialize_rules = ('-accounts','-bank','-user')


class Bank(db.Model, SerializerMixin):
    __tablename__ = "banks"
    id = db.Column(db.Integer, primary_key=True)
    bank_name = db.Column(db.String, unique = True)
    brand_color=db.Column(db.String)

    transactions = association_proxy('accounts', 'transactions',
        creator=lambda transaction_obj: Transactions(transactions =  transaction_obj))
    
    users = association_proxy('accounts', 'users',
        creator = lambda users_obj: Users(users = users_obj))

    accounts = db.relationship('Accounts', back_populates = 'banks')

    serialize_rules = ('-accounts','-transactions','-users')

class Accounts(db.Model, SerializerMixin):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key="True")
    bank_id = db.Column(db.Integer, db.ForeignKey('banks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'))
    account_value = db.Column(db.String)
    transaction_count = db.Column(db.Integer)

    banks = db.relationship('Bank', back_populates = 'accounts')
    transactions = db.relationship('Transactions', back_populates = 'accounts')
    users = db.relationship('Users', back_populates = 'accounts')

    serialize_rules = ('-banks','-transactions','-users')