from flask import Flask
from flask_restful import Resource, Api
from config import app, db, api

#Members API Route

class Home(Resource):
    def get(self):
        return({"members": ["Mamber1","Member2", "Member3"]},200)


api.add_resource(Home, '/api')

if __name__ == '__main__':
    app.run(port=5555, debug=True)