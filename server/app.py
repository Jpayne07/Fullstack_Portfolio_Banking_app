from flask import Flask, request, session, make_response, redirect, jsonify, send_from_directory, render_template
import os
from flask_restful import Resource
from config import app, db, api, GITHUB_API_URL, GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_AUTH_URL, GITHUB_TOKEN_URL
from models import Accounts, Transactions, User, Bank, Cards
from faker import Faker
import random
from werkzeug.exceptions import Unauthorized
import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta   
from sqlalchemy.exc import IntegrityError


fake = Faker()
# Serve static assets (JS, CSS, images, etc.)
@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")


class User_Item(Resource):
    def get(self):
        if session['user_id']:
            userid = User.query.filter_by(id=session['user_id']).first()
        else:
            return make_response("You must be logged in to see this content", 405)
        return(userid.to_dict(), 200)
    
class Signup(Resource):
    def post(self):
        data = request.get_json()        
        if not data:
            raise Unauthorized("Please enter a valid username and password")

        try:
            user_object = User(
                username=data["username"]
            )
            # Use the password property if available; otherwise, ensure validation occurs.
            user_object.password_hash = data['password']

            db.session.add(user_object)
            db.session.commit()
        except ValueError as ve:
            return {"error": str(ve)}, 400
        except IntegrityError as ie:
            db.session.rollback()  # Always rollback on an error
            return {"error": f"Username is taken"}, 400
        except Exception as e:
            db.session.rollback()
            return {"error": "Something went wrong: " + str(e)}, 500

        return {"message": "New user added"}, 201
    
class Transactions_List(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transactions.query.all()]
        return(transactions,200)   

class IndivdiualTransaction(Resource):
    def delete(self, id):
        transaction = Transactions.query.filter_by(id=id).first()
        if session:
            if transaction.user.id == session['user_id']:
                db.session.delete(transaction)
                db.session.commit()
        else:
            return("You must be signed in to delete this transaction", 500)
        
    def patch(self, id):
        transaction = Transactions.query.filter_by(id=id).first()
        data = request.get_json()
        try:
            for key, value in data.items():
                if hasattr(transaction, key):  # Ensure the attribute exists on the model
                    if key =='created_at':
                        setattr(transaction, key, datetime.strptime(value,"%m/%d/%Y"))
                    elif key =='title':
                      setattr(transaction, key, value)
                    elif key =='amount':
                      setattr(transaction, key, int(value))  
            
                db.session.commit()
                return transaction.to_dict(), 200
        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
class TransactionSeed(Resource):
    def post(self):  # Change to POST for creating resources
        data = request.get_json()
        print(data)
        id = data['id']
        db.session.commit()
        money_categories = ['shopping', 'coffee ', 'subs', 'food', 'groceries', 'rent']
        transaction_type_categories = ['Negative', 'Positive']
        for _ in range(100):
            transaction = Transactions(
            title=fake.company(),
            category=random.choice(money_categories),  # Choose from the 5 predefined categories
            amount=round(random.uniform(1, 100), 0),  # Random amount between 1 and 1000 with 2 decimal places
            account_id=id,
            transaction_type=random.choice(transaction_type_categories)
        )
            db.session.add(transaction)
            

        db.session.commit()
        account = db.session.query(Accounts).filter_by(id=id).first()
        if account:
            print("in account")
            account.transaction_id = transaction.id  # Update transaction reference
            db.session.commit()

        data = {"message": "Transactions seeded successfully"}
        return data, 201  # Return success response
    
class Banks(Resource):
    def get(self):
        banks = [bank.to_dict() for bank in Bank.query.all()]
        return(banks,200)
    
class Insights(Resource):
    def get(self):
        print('Session in insights', session)
        user = User.query.filter(User.id == session['user_id']).first()
        if user:
            accounts = [account.to_dict() for account in user.accounts]
            transaction_categories = {}
            for account in accounts:
                for transaction in account['transactions']:
                    category = transaction['category']
                    # only calculating spending
                    if transaction['transaction_type'] == "Negative":
                        if category in transaction_categories:

                            # key += value
                            transaction_categories[category] += transaction['amount']
                        else:
                            # setting first find of transaction category
                            transaction_categories[category] = transaction['amount']

        else:
            return {"message": "You must sign in to see this"}, 405
        return(transaction_categories,200)
    
class Account(Resource):
    def get(self):
        if session['user_id']:
            user = User.query.filter(User.id == session['user_id']).first().to_dict()
            return user
        else:
            return {"message": "You must sign in to see this"}, 405
        
    def post(self):
        if session['user_id']:
            data = request.get_json()
            bank = Bank.query.filter(Bank.name == data['bank_name']).first()
            if bank:
                bank_id = bank.to_dict()['id']
                card = Cards.query.all()
                card_id = card[-1].to_dict()['id'] + 1
                account = Accounts(
                    bank_id = bank_id,
                    card_id = card_id,
                    user_id = session['user_id'],
                    account_value = float(data['account_value']),
                    account_type = data['account_type']
                )
                new_card = Cards(
                card_number=account.generate_unique_card_number(),
                expiration_date=datetime.now().date() + relativedelta(years=3),
                )
                print('test2')
                db.session.add_all([new_card, account])
                db.session.commit()
            else:
                new_bank = Bank(name = data['bank_name'])
                db.session.add(new_bank)
                db.session.commit()
                bank = Bank.query.filter(Bank.name == data['bank_name']).first().to_dict()['id']
                card = Cards.query.all()
                new_card = Cards(
                card_number=account.generate_unique_card_number(),
                expiration_date=datetime.now().date() + relativedelta(years=3),
                )
                card_id = card[-1].to_dict()['id']
                account = Accounts(
                    bank_id = bank,
                    card_id = card_id,
                    user_id = session['user_id'],
                    account_value = float(data['account_value']),
                    account_type = data['account_type']
                )
                db.session.add(account)
                db.session.commit()

                
                db.session.add(new_card)
                db.session.commit()
                return make_response("Adding new bank to database, bank account created", 201)

                
        else:
            return {"message": "You must sign in to see this"}, 405
    
class SingularAccount(Resource):
    def delete(self, id):
        if session['user_id']:
            account  = Accounts.query.filter(id == id).first()
            db.session.delete(account)
            db.session.commit()
            make_response = (f"Account with id:{account.id} deleted", 204)
            return make_response
        else:
            return {"message": "You must sign in to see this"}, 405

class Login(Resource):
    def post(self):
        user_object = request.get_json()
        user = User.query.filter(User.username == user_object['username']).first()
        if user:
            if user.authenticate(user_object['password']):
                session['user_id'] = user.to_dict()['id']
                print("Session set:", session)
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
        user = User.query.filter_by(username=username).first()
        if user:
        # Existing user: log them in by saving their info in the session
            session["user_id"] = user.to_dict()['id']
            print('already logged in')
            return redirect('http://localhost:3000')
        else:
            new_user = User(username=username)
            new_user.password_hash = "Test"

        db.session.add(new_user)
        db.session.commit()
        print(User.query.filter_by(username=new_user.username).first().id)
        # Log them in by saving their info in the session
        session["user_id"] = User.query.filter_by(username=new_user.username).first().id
        return redirect('http://localhost:3000')

        # Store user details in the session
       
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id') 
        print(session)
        if user_id:
            id = session['user_id']
            user = User.query.filter_by(id=id).first().to_dict()
            response = make_response(user, 200)
            return response
        else:
            print("didn't get user id")
            response = make_response("Not authorized", 401)
            return response

class ClearSession(Resource):
    def delete(self):
        session.clear()
        response = make_response({'message': 'Logged out, session cleared.'}, 204)
        response.delete_cookie('session')
        return response




api.add_resource(Account, '/api/account')
api.add_resource(SingularAccount, '/api/singular_account/<int:id>')
api.add_resource(Banks, '/api/banks')
api.add_resource(Transactions_List, '/api/transaction')
api.add_resource(TransactionSeed, '/api/transactionseed')
api.add_resource(User_Item, '/api/user')
api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Login, '/api/login')
api.add_resource(Signup, '/api/signup')
api.add_resource(LoginWithGithub, '/api/login-github')
api.add_resource(ClearSession, '/api/clear_session')
api.add_resource(Callback, '/callback')
api.add_resource(IndivdiualTransaction, '/api/transaction/<int:id>')
api.add_resource(Insights, '/api/insights')

# @app.route('/static/<path:filename>')
# def serve_static(filename):
#     print(f"Serving static file: {filename}")
#     return send_from_directory(os.path.join(app.static_folder, 'static'), filename)

# # Catch-all route: serve index.html for all routes not caught by other routes
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react(path):
#     absolute_path = os.path.join(app.static_folder, path)
#     print(f"Requested path: '{path}' resolves to '{absolute_path}'")
#     if path != "" and os.path.exists(absolute_path):
#         print(f"Found file: {absolute_path}. Serving file.")
#         return send_from_directory(app.static_folder, path)
#     else:
#         print("File not found; serving index.html for React routing.")
#         return send_from_directory(app.static_folder, 'index.html')

# Optional: Custom error handler for 404 (if needed)
@app.errorhandler(404)
def not_found(e):
    # If the request path starts with /api, return a JSON response
    if request.path.startswith('/api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    # Otherwise, serve the React app
    print(f"404 error encountered: {e}. Serving index.html")
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)