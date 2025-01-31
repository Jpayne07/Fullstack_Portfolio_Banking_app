from flask import Flask, request, session, make_response, redirect, jsonify
from flask_restful import Resource, Api
from config import app, db, api, GITHUB_API_URL, GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_AUTH_URL, GITHUB_TOKEN_URL
from models import Accounts, Transactions, Users, Bank, Card
from faker import Faker
import random
from werkzeug.exceptions import UnprocessableEntity, Unauthorized
from urllib.parse import urlparse
import requests



#Members API Route
# @app.before_request
# def check_if_logged_in():
#     if not session['user_id']:
#         return {'error': 'Unauthorized'}, 401
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
    

class IndivdiualTransaction(Resource):
    def get(self, id):
        
        transaction = Transactions.query.filter_by(id=id).first()
        # if transaction['account_id'] in user.
        # if session['user_id'] = transaction
        return(transaction.to_dict(),200)
    def delete(self, id):
        transaction = Transactions.query.filter_by(id=id).first()
        db.session.delete(transaction)
        db.session.commit()
    def patch(self, id):
        transaction = Transactions.query.filter_by(id=id).first()

        data = request.get_json()
        for key, value in data.items():
            if hasattr(transaction, key):  # Ensure the attribute exists on the model
                setattr(transaction, key, value)
    
        # Commit the changes to the database
        try:
            db.session.commit()
            return transaction.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
class TransactionSeed(Resource):
    def post(self):  # Change to POST for creating resources
        db.session.query(Transactions).delete()  # Deletes all rows in the Transactions table
        db.session.commit()
        money_categories = ['salary', 'invoice', 'payment', 'refund', 'transfer']

        for _ in range(100):
            transaction = Transactions(
        title=fake.company(),
        category=random.choice(money_categories),  # Choose from the 5 predefined categories
        amount=round(random.uniform(1, 1000), 0),  # Random amount between 1 and 1000 with 2 decimal places
        account_id=random.choice([1, 2, 3, 4])
    )
            print(transaction.to_dict())
            db.session.add(transaction)

        db.session.commit()
        random_integer = random.randint(1, 2)
        account = db.session.query(Accounts).filter_by(id=random_integer).first()
        if account:
            account.transaction_id = transaction.id  # Update transaction reference
            db.session.commit()

        data = {"message": "Transactions seeded successfully"}
        return data, 201  # Return success response

    
class Banks(Resource):
    def get(self):
        user = Users.query.filter(Users.id == session['user_id']).first()
        
        if user:
            bank_ids = [account.bank_id for account in user.accounts] 
            banks = [bank.to_dict() for bank in Bank.query.filter(Bank.id.in_(bank_ids)).all()]
        else:
            return {"message": "You must sign in to see this"}, 405
        return(banks,200)
class Insights(Resource):
    def get(self):
        user = Users.query.filter(Users.id == session['user_id']).first()
        print(user)
        # user = None
        if user:
            bank_ids = [account.bank_id for account in user.accounts] 
            banks = [bank.to_dict() for bank in Bank.query.filter(Bank.id.in_(bank_ids)).all()]
            transaction_categories = {}
            for bank in banks:
                for account in bank['accounts']:
                    for transaction in account['transactions']:
                        category = transaction['category']
                        if category in transaction_categories:
                            transaction_categories[category] += transaction['amount']
                        else:
                            transaction_categories[category] = transaction['amount']

        else:
            return {"message": "You must sign in to see this"}, 405
        return(transaction_categories,200)
    
class Account(Resource):
    def get(self):
        accounts = [account.to_dict() for account in Accounts.query.all()]
        return(accounts,200)
    
class Cards(Resource):
    def get(self):
        cards = [cards.to_dict() for cards in Card.query.all()]
        return(cards,200)
    
class Signup(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        if data:
            user_object = Users(
                username = data["username"]
            )
            user_object.password_hash = data['password']
        else:
            raise Unauthorized("Username or password are incorrect")
        
        db.session.add(user_object)
        db.session.commit()
        return("New user added", 201)
class Login(Resource):
    def post(self):
        user_object = request.get_json()
        user = Users.query.filter(Users.username == user_object['username']).first()
        print(user)
        if user:
            if user.authenticate(user_object['password']):
                session['user_id'] = user.to_dict()['id']
                return user.to_dict(), 200
        return {"message": "Username or password are incorrect"}, 401

class LoginWithGithub(Resource):
    def get(self):
        return (redirect(f'{GITHUB_AUTH_URL}?client_id={GITHUB_CLIENT_ID}'))
    

    
class Callback(Resource):
     def get(self):
        code = request.args.get('code')
        if code:
            session['github_code'] = code
        else:
            return 'No code found in URL', 400
        token_response = requests.post(
        GITHUB_TOKEN_URL,
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        },
    )
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        if not access_token:
            return "Error: Unable to fetch access token", 400
        user_response = requests.get(
        GITHUB_API_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
        user_data = user_response.json()
        github_id = user_data.get("id")
        username = user_data.get("login")

        if not github_id or not username:
            return jsonify({"error": "Failed to fetch GitHub user data"}), 400
        user = Users.query.filter_by(username=username).first()
        if user:
        # Existing user: log them in by saving their info in the session
            session["user_id"] = user.to_dict()['id']
            print('already logged in')
            return redirect('http://localhost:3000')
        else:
            new_user = Users(username=username)

        db.session.add(new_user)
        db.session.commit()
        print(Users.query.filter_by(username=new_user.username).first().id)
        # Log them in by saving their info in the session
        session["user_id"] = Users.query.filter_by(username=new_user.username).first().id
        return redirect('http://localhost:3000')

        # Store user details in the session
        
            
        
        
    
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
    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204



api.add_resource(Home, '/api')
api.add_resource(Account, '/api/account')
api.add_resource(Cards, '/api/cards')
api.add_resource(Banks, '/api/banks')
api.add_resource(Transaction, '/api/transaction')
api.add_resource(TransactionSeed, '/api/transactionseed')
api.add_resource(User, '/api/user')
api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Login, '/api/login')
api.add_resource(Signup, '/api/signup')
api.add_resource(LoginWithGithub, '/api/login-github')
api.add_resource(ClearSession, '/api/clear_session')
api.add_resource(Callback, '/callback')
api.add_resource(IndivdiualTransaction, '/api/transaction/<int:id>')
api.add_resource(Insights, '/api/insights')


if __name__ == '__main__':
    app.run(port=5555, debug=True)