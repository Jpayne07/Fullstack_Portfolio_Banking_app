from app import app
from models import db, Users, Accounts, Transactions, Bank


if __name__ =='__main__':
    with app.app_context():
        from app import db

        db.drop_all()
        db.create_all()

        user1 = Users(
            username = 'Jacob',
            account_type = 'Checking',
            password = 'Hi'
        )

        user2 = Users(
            username = 'Hunter',
            account_type = 'Savings',
            password = 'Hi'
        )

        db.session.add_all([user1, user2])
        db.session.commit()

        transaction1 = Transactions(
            title = 'Dunkin',
            category = 'Fastfood',
        )
        
        transaction2 = Transactions(
            title = 'FPL',
            category = 'Utilities',
        )

        db.session.add_all([transaction1, transaction2])
        db.session.commit()

        bank1 = Bank(
            bank_name = 'Regions',
            brand_color = 'Green'

        )

        bank2 = Bank(
            bank_name = 'Wells Fargo',
            brand_color = 'Red'
        )

        db.session.add_all([bank1, bank2])
        db.session.commit()

        account1 = Accounts(
            bank_id = 1,
            user_id = 1,
            transaction_id = 1,
            account_value = 100000,
            transaction_count = 2
        )
    
        account2 = Accounts(
            bank_id = 2,
            user_id = 2,
            transaction_id = 2,
            account_value = 100000,
            transaction_count = 2
        )
        db.session.add_all([account1, account2])
        db.session.commit()
    print("Database seeded successfully!")