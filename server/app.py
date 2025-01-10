from flask import Flask
from flask_restful import Resource, Api
from config import app, db, api
from models import Accounts, Transactions, Users, Bank

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