from flask import Flask, request
from flask_restful import Resource, Api
from config import app, db, api
from models import Accounts, Transactions, Users, Bank
from faker import Faker
fake = Faker()

#Members API Route

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
    
    def post(self):
        db.session.query(Transactions).delete()  # Deletes all rows in the Transactions table
        db.session.commit()
        for _ in range(10):
            
            transaction = Transactions(
                title = fake.company(),
                category = fake.word(),
                amount = round(fake.random_number(digits=3), 2)  # Random amount with 2 decimal places
            )
            print(transaction.to_dict())
            db.session.add(transaction)
        
        db.session.commit()
        data = request.get_json()
        print(data)
        return(data, 201)
    
class Banks(Resource):
    def get(self):
        banks = [bank.to_dict() for bank in Bank.query.all()]
        return(banks,200)
    
class Account(Resource):
    def get(self):
        accounts = [account.to_dict() for account in Accounts.query.all()]
        return(accounts,200)


api.add_resource(Home, '/api')
api.add_resource(Account, '/api/account')
api.add_resource(Banks, '/api/banks')
api.add_resource(Transaction, '/api/transaction')
api.add_resource(User, '/api/user')


if __name__ == '__main__':
    app.run(port=5555, debug=True)