from sqlalchemy import Column
from sqlalchemy.orm import relationship
from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.types import DateTime
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property


class Users(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True)
    _password_hash = db.Column(db.String)

    @property
    def transactions(self):
        return [transaction for account in self.accounts for transaction in account.transactions]

        
    bank = association_proxy('accounts', 'banks',
            creator = lambda bank_obj: Bank(bank = bank_obj))
    
    cards = association_proxy('accounts', 'cards',
            creator = lambda card_obj: Card(card = card_obj))
    
    accounts = db.relationship('Accounts', back_populates = 'users')
    serialize_rules = ('-accounts.users','-bank','-transactions')

    @hybrid_property
    def password_hash(self):
        raise AttributeError("password_hash is not accessible.")

    @password_hash.setter
    def password_hash(self, password):
        # utf-8 encoding and decoding is required in python 3
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

class Bank(db.Model, SerializerMixin):
    __tablename__ = "banks"
    id = db.Column(db.Integer, primary_key=True)
    bank_name = db.Column(db.String, unique = True)
    brand_color=db.Column(db.String)

    transactions = association_proxy('accounts', 'transactions',
        creator=lambda transaction_obj: Transactions(transactions =  transaction_obj))
    
    users = association_proxy('accounts', 'users',
        creator = lambda users_obj: Users(users = users_obj))
    
    cards = association_proxy('accounts', 'cards',
            creator = lambda card_obj: Card(card = card_obj))

    accounts = db.relationship('Accounts', back_populates = 'banks', cascade='all, delete-orphan')

    

    serialize_rules = ('-accounts.bank','-transactions','-users')

class Card(db.Model, SerializerMixin):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.Integer, unique = True)
    expiration_date = db.Column(db.Date)

    accounts = db.relationship('Accounts', back_populates = 'cards')
    serialize_rules = ('-accounts.cards',)

class Accounts(db.Model, SerializerMixin):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key="True")
    bank_id = db.Column(db.Integer, db.ForeignKey('banks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'))
    # transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'))
    account_value = db.Column(db.String)
    account_type = db.Column(db.String)

    banks = db.relationship('Bank', back_populates = 'accounts')
    cards = db.relationship('Card', back_populates = 'accounts')
    transactions = db.relationship('Transactions', back_populates = 'accounts')
    users = db.relationship('Users', back_populates = 'accounts')

    serialize_rules = ('-banks.accounts','-transactions.accounts','-users')

    

class Transactions(db.Model, SerializerMixin):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key = True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    title = db.Column(db.String)
    category = db.Column(db.String)
    created_at = Column(DateTime, default=datetime.utcnow)
    amount = db.Column(db.Integer)


    user = association_proxy('accounts', 'users',
        creator=lambda user_obj: Users(user = user_obj))
    
    bank = association_proxy('accounts', 'banks',
            creator=lambda bank_obj: Bank(bank = bank_obj))

    accounts = db.relationship('Accounts', back_populates = 'transactions')
    serialize_rules = ('-accounts','-bank','-user')