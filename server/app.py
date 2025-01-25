from flask import Flask, request, session, make_response
from flask_restful import Resource, Api
from config import app, db, api
from models import Accounts, Transactions, Users, Bank, Card
from faker import Faker
import random
from werkzeug.exceptions import UnprocessableEntity, Unauthorized



#Members API Route
fake = Faker()
class Home(Resource):
    def get(self):
        return({"members": ["Mamber1","Member2", "Member3"]},200)
    
class User(Resource):
    def get(self):
        users = [user.to_dict() for user in Users.query.all()]
        return(users, 200)
    
class Transaction(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transactions.query.all()]
        return(transactions,200)
class TransactionSeed(Resource):
    def post(self):  # Change to POST for creating resources
        db.session.query(Transactions).delete()  # Deletes all rows in the Transactions table
        db.session.commit()
        for _ in range(10):
            transaction = Transactions(
                title=fake.company(),
                category=fake.word(),
                amount=round(fake.random_number(digits=3), 2)  # Random amount with 2 decimal places
            )
            print(transaction.to_dict())
            db.session.add(transaction)

        db.session.commit()
        random_integer = random.randint(1, 2)
        account = db.session.query(Accounts).filter_by(id=random_integer).first()
        if account:
            account.transaction_id = transaction.id  # Update transaction reference
            account.transaction_count += 1  # Increment the transaction count
            db.session.commit()

        data = {"message": "Transactions seeded successfully"}
        return data, 201  # Return success response

    
class Banks(Resource):
    def get(self):
        banks = [bank.to_dict() for bank in Bank.query.all()]
        return(banks,200)
    
class Account(Resource):
    def get(self):
        accounts = [account.to_dict() for account in Accounts.query.all()]
        return(accounts,200)
    
class Cards(Resource):
    def get(self):
        cards = [cards.to_dict() for cards in Card.query.all()]
        return(cards,200)
    
class Login(Resource):
    def post(self):
        user_object = request.get_json()
        user = Users.query.filter(Users.username == user_object['username']).first()
        if user:
            if user.authenticate(user_object['password']):
                session['user_id'] = user.to_dict()['id']
                return user.to_dict(), 200
        else:
            raise Unauthorized("Username or password are incorrect")
        
    
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id') 

        if user_id:
            id = session['user_id']
            user = Users.query.filter_by(id=id).first().to_dict()
            user_no_pass = {
                'id': session['user_id'],
                'username': user['username'],
            }
            response = make_response(user_no_pass, 200)
            return response
        else:
            response = make_response("Not authorized", 401)
            return response
class ClearSession(Resource):
    def get(self):
        session['user_id'] = None
        return ('User Cleared', 201)



api.add_resource(Home, '/api')
api.add_resource(Account, '/api/account')
api.add_resource(Cards, '/api/cards')
api.add_resource(Banks, '/api/banks')
api.add_resource(Transaction, '/api/transaction')
api.add_resource(TransactionSeed, '/api/transactionseed')
api.add_resource(User, '/api/user')
api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Login, '/api/login')
api.add_resource(ClearSession, '/api/clear_session')


if __name__ == '__main__':
    app.run(port=5555, debug=True)