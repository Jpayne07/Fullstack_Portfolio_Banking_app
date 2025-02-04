"""reverting to new structure

Revision ID: 73e727715113
Revises: 42a2bf8d69d2
Create Date: 2025-02-03 11:39:56.796153

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '73e727715113'
down_revision = '42a2bf8d69d2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('banks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(), nullable=True))
        batch_op.drop_constraint('uq_banks_bank_name', type_='unique')
        batch_op.create_unique_constraint(batch_op.f('uq_banks_name'), ['name'])
        batch_op.drop_column('bank_name')
        batch_op.drop_column('brand_color')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('banks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('brand_color', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('bank_name', sa.VARCHAR(), nullable=True))
        batch_op.drop_constraint(batch_op.f('uq_banks_name'), type_='unique')
        batch_op.create_unique_constraint('uq_banks_bank_name', ['bank_name'])
        batch_op.drop_column('name')

    # ### end Alembic commands ###
