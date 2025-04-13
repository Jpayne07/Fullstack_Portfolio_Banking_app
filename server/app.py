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
        if session['user_id']:
            user = User.query.filter(User.id == session['user_id']).first()
            transactions = [transaction.to_dict() for transaction in user.transactions]
            return transactions
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
        id = data['id']
        db.session.commit()
        money_categories = ['shopping', 'coffee ', 'subs', 'food', 'groceries', 'rent']
        transaction_type_categories = ['Negative', 'Positive']
        transaction_list_Index = []
        for _ in range(25):
            transaction = Transactions(
            title=fake.company(),
            category=random.choice(money_categories),  # Choose from the 5 predefined categories
            amount=round(random.uniform(1, 100), 0),  # Random amount between 1 and 1000 with 2 decimal places
            account_id=id,
            transaction_type=random.choice(transaction_type_categories)
        );  
            transaction_list_Index.append(transaction)
            db.session.add(transaction)
            

        db.session.commit()
        account = db.session.query(Accounts).filter_by(id=id).first()
        cardItem = Accounts.query.filter_by(id=id).first().to_dict()['card']

        if account:
            print("in account")
            account.transaction_id = transaction.id  # Update transaction reference
            db.session.commit()

        transaction_list = []
        for transaction in transaction_list_Index:
            t_dict = transaction.to_dict()
            t_dict['card'] = cardItem
            transaction_list.append(t_dict)

      
        return transaction_list, 201  # Return success response
    
class Banks(Resource):
    def get(self):
        banks = [bank.to_dict() for bank in Bank.query.all()]
        return(banks,200)
    
class Account(Resource):
    def get(self):
        if session['user_id']:
            user = User.query.filter(User.id == session['user_id']).first()
            accounts = [account.to_dict() for account in user.accounts]
            return accounts
        else:
            return {"message": "You must sign in to see this"}, 405
        
    def post(self):
        if session['user_id']:
            data = request.get_json()
            print(data)
            bank = Bank.query.filter(Bank.name == data['bank_name']).first()
            try:
                if bank:
                    bank_id = bank.to_dict()['id']
                    card = Cards.query.all()
                    card_id = card[-1].to_dict()['id'] + 1
                    account = Accounts(
                        bank_id = bank_id,
                        card_id = card_id,
                        user_id = session['user_id'],
                        account_value = float(data['account_value']),
                        account_type = data['account_type'],
                    )
                    new_card = Cards(
                    card_number=data['cardNumber'],
                    expiration_date=datetime.now().date() + relativedelta(years=3),
                    )
                    db.session.add(new_card)
                    db.session.commit()
                    db.session.add(account)
                    db.session.commit()
                    return (account.to_dict(), 201)
                else:
                    new_bank = Bank(name = data['bank_name'])
                    db.session.add(new_bank)
                    db.session.commit()
                    card = Cards.query.all()
                    card_id = card[-1].to_dict()['id'] + 1
                    account = Accounts(
                        bank_id = new_bank.id,
                        card_id = card_id,
                        user_id = session['user_id'],
                        account_value = float(data['account_value']),
                        account_type = data['account_type']
                    )
                    new_card = Cards(
                    card_number=data['cardNumber'],
                    expiration_date=datetime.now().date() + relativedelta(years=3),
                    )
                    db.session.add(new_card)
                    db.session.commit()
                    db.session.add(account)
                    db.session.commit()
                    return (account.to_dict(), 201)
            except ValueError as ve:
                return {"error": str(ve)}, 400
            except IntegrityError as ie:
                db.session.rollback()
                print('test')  # Always rollback on an error

                return ('card is taken'), 400
            except Exception as e:
                db.session.rollback()
                return {"error": "Something went wrong: " + str(e)}, 500


                
        else:
            return {"message": "You must sign in to see this"}, 405
    
class SingularAccount(Resource):
    def delete(self, id):
        if 'user_id' in session:
            account = Accounts.query.get(id)
            if account:
                db.session.delete(account)
                db.session.commit()
                return {"message": f"Account with id {id} deleted"}, 204
            else:
                return {"message": "Account not found"}, 404
        else:
            return {"message": "You must sign in to see this"}, 405

class Login(Resource):
    def post(self):
        user_object = request.get_json()
        user = User.query.filter(User.username == user_object['username']).first()
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
        user = User.query.filter_by(username=username).first()
        if user:
        # Existing user: log them in by saving their info in the session
            session["user_id"] = user.to_dict()['id']
            print('already logged in')
            return redirect('/')
        else:
            new_user = User(username=username)
            new_user.password_hash = "Test"

        db.session.add(new_user)
        db.session.commit()
        print(User.query.filter_by(username=new_user.username).first().id)
        # Log them in by saving their info in the session
        session["user_id"] = User.query.filter_by(username=new_user.username).first().id
        return redirect('/')

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




api.add_resource(Account, '/api/bank/accounts')
api.add_resource(SingularAccount, '/api/bank/singular_account/<int:id>')
api.add_resource(Banks, '/api/bank/banks')
api.add_resource(Transactions_List, '/api/bank/transactions')
api.add_resource(TransactionSeed, '/api/bank/transactionseed')
api.add_resource(User_Item, '/api/bank/user')
api.add_resource(CheckSession, '/api/bank/check_session')
api.add_resource(Login, '/api/bank/login')
api.add_resource(Signup, '/api/bank/signup')
api.add_resource(LoginWithGithub, '/api/bank/login-github')
api.add_resource(ClearSession, '/api/bank/clear_session')
api.add_resource(Callback, '/callback')
api.add_resource(IndivdiualTransaction, '/api/bank/transaction/<int:id>')

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