from app import app
from models import db, User, Accounts, Transactions, Bank, Cards
from faker import Faker
from datetime import datetime, date
from dateutil.relativedelta import relativedelta   


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

        card1 = Cards(
            card_number = 123456789123,
            expiration_date = datetime.now().date()   + relativedelta(years=3)
            
        )
    
        card2 = Cards(
            card_number = 123456789124,
            expiration_date = datetime.now().date()  + relativedelta(years=3)
            
        )

        card3 = Cards(
            card_number = 123456789125,
            expiration_date = datetime.now().date()  + relativedelta(years=3)
            
        )
        db.session.add_all([card1, card2, card3])
        db.session.commit()
    print("Database seeded successfully!")