from sqlalchemy import Column
from sqlalchemy.orm import relationship
from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.types import DateTime
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates



class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True)
    _password_hash = db.Column(db.String)

    @property
    def transactions(self):
        return [transaction for account in self.accounts for transaction in account.transactions]

    
    banks = association_proxy('accounts', 'banks',
            creator = lambda card_obj: Bank(card = card_obj))
    
    # cards = association_proxy('accounts', 'cards',
    #         creator = lambda card_obj: Card(card = card_obj))
    
    accounts = db.relationship('Accounts', back_populates = 'user')
    serialize_rules = ('-accounts.user','-bank.user','-transactions.user',)
    # serialize_only = ('accounts.user',)

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
    name = db.Column(db.String, unique = True)
    # brand_color=db.Column(db.String)

    transactions = association_proxy('accounts', 'transactions',
        creator=lambda transaction_obj: Transactions(transactions =  transaction_obj))
    
    user = association_proxy('accounts', 'user',
        creator = lambda users_obj: User(user = users_obj))
    
    cards = association_proxy('accounts', 'cards',
            creator = lambda card_obj: Cards(card = card_obj))

    accounts = db.relationship('Accounts', back_populates = 'bank', cascade='all, delete-orphan')

    

    serialize_rules = ('-accounts',)

class Cards(db.Model, SerializerMixin):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.Integer, unique = True)
    expiration_date = db.Column(db.Date)
    # transactions = association_proxy('accounts', 'transactions',
    #     creator=lambda transaction_obj: Transactions(transactions =  transaction_obj))
    account = db.relationship('Accounts', back_populates = 'card')
    serialize_rules = ('-account','-transactions.card')


class Accounts(db.Model, SerializerMixin):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key="True")
    bank_id = db.Column(db.Integer, db.ForeignKey('banks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'))

    account_value = db.Column(db.String)
    account_type = db.Column(db.String)

    bank = db.relationship('Bank', back_populates = 'accounts')
    card = db.relationship('Cards', back_populates = 'account')
    transactions = db.relationship('Transactions', back_populates = 'account')
    user = db.relationship('User', back_populates = 'accounts')

    serialize_rules = ('-bank.accounts', '-transactions.account', '-users', '-card.account', 'transactions.card')


    

class Transactions(db.Model, SerializerMixin):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key = True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    title = db.Column(db.String)
    category = db.Column(db.String)
    created_at = Column(DateTime, default=datetime.utcnow)
    amount = db.Column(db.Integer)
    transaction_type = db.Column(db.String)

    @validates('transaction_type')
    def validate_transaction(self, key, address):
        if address !='Negative' and address!='Positive':
            print(address)
            raise ValueError("Transaction type must be of string 'Positive' or of string 'Negative'")
        return address

    user = association_proxy('account', 'user',
        creator=lambda user_obj: User(user = user_obj))
    
    bank = association_proxy('account', 'banks',
            creator=lambda bank_obj: Bank(bank = bank_obj))
    
    card = association_proxy('account', 'card',
            creator=lambda card_obj: Cards(card = card_obj))

    account = db.relationship('Accounts', back_populates = 'transactions')
    serialize_rules = ('-account', '-bank', '-user')
