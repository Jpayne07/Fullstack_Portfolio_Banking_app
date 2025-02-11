from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import validates
from sqlalchemy.orm import relationship
from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.types import DateTime
from datetime import datetime, date
from dateutil.relativedelta import relativedelta   

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates



class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), unique = True)
    # password validation handled on the frontend
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
    name = db.Column(db.String(60), unique = True)

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

    account = db.relationship('Accounts', back_populates = 'card')

    @validates('expiration_date')
    def validate_expiry(self, key, expiration_date):
        expected_date = datetime.now().date() + relativedelta(years=3) # Convert to `date`
        if expiration_date != expected_date:
            raise ValueError("Expiration date must be exactly 3 years from today")
        return expiration_date

    @validates('card_number')
    def validate_car_number(self, key, card_number):
        if len(str(card_number)) !=12:
            raise ValueError("Card number must be exactly 12 digits")
        return card_number

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

    @validates('account_value')
    def validate_account_value(self, key, value):
        if value < 0 or value > 1000000000000:
            print(value)
            raise ValueError("Account value can't be negative or greater than 1 Trillion")
        return value

    serialize_rules = ('-bank.accounts', '-transactions.account', '-users', '-card.account', 'transactions.card')


    

class Transactions(db.Model, SerializerMixin):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key = True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    title = db.Column(db.String(10))
    category = db.Column(db.String(10))
    created_at = Column(DateTime, default=datetime.utcnow)
    amount = db.Column(db.Integer)
    transaction_type = db.Column(db.String)

    @validates('amount')
    def validate_transaction_amount(self, key, number):
        if number is None:
            raise ValueError("Amount cannot be null")
        if not isinstance(number, (int, float)):  # Ensures it's a number
            raise ValueError("Amount must be a number")
        if number < 0:
            raise ValueError("Amount cannot be negative")
        return number

    @validates('transaction_type')
    def validate_transaction_type(self, key, transaction_type):
        if transaction_type !='Negative' and transaction_type!='Positive':
            print(transaction_type)
            raise ValueError("Transaction type must be of string 'Positive' or of string 'Negative'")
        return transaction_type
    
    @validates('created_at')
    def validate_transaction_date(self, key, date):
        if date < '01-01-1960' or date > datetime.utcnow:
            raise ValueError("Transaction date must be after Jan 1 1960 and can't be after today.")
        return date

    user = association_proxy('account', 'user',
        creator=lambda user_obj: User(user = user_obj))
    
    bank = association_proxy('account', 'banks',
            creator=lambda bank_obj: Bank(bank = bank_obj))
    
    card = association_proxy('account', 'card',
            creator=lambda card_obj: Cards(card = card_obj))

    account = db.relationship('Accounts', back_populates = 'transactions')
    serialize_rules = ('-account', '-bank', '-user')
