from app import app
from models import db, User, Accounts, Transactions, Bank, Card
from faker import Faker
from datetime import date

fake = Faker()

if __name__ =='__main__':
    with app.app_context():
        from app import db

        db.drop_all()
        db.create_all()

        user1 = User(
            username = 'Jacob',
           
        )
        user1.password_hash = "hi"
        user2 = User(
            username = 'Hunter',
           
        )
        user2.password_hash = "hi"

        db.session.add_all([user1, user2])
        db.session.commit()

        


        bank1 = Bank(
            name = 'Regions',

        )

        bank2 = Bank(
            name = 'Wells Fargo',
        )
        
        db.session.add_all([bank1, bank2])
        db.session.commit()

        account1 = Accounts(
            bank_id = 1,
            user_id = 1,
            account_value = 100000,
            account_type = "Checking",
            card_id = 2
        )
    
        account2 = Accounts(
            bank_id = 2,
            user_id = 2,
            account_value = 100000,
            account_type = "Savings",
            card_id = 1
        )

        account3 = Accounts(
            bank_id = 2,
            user_id = 2,
            account_value = 100000,
            account_type = "Savings",
            card_id = 3
        )
        db.session.add_all([account1, account2,account3])
        db.session.commit()

        card1 = Card(
            card_number = 12340123404560789,
            expiration_date = date(2024, 1, 5)
            
        )
    
        card2 = Card(
            card_number = 99990123404560789,
            expiration_date = date(2023, 12, 15)
            
        )
        db.session.add_all([card1, card2])
        db.session.commit()
    print("Database seeded successfully!")