from models import Algorithm
from models import db

def add_default_values_to_model():
    # Check if the default values already exist in the database
    existing_default_values = Algorithm.query.filter_by(name='Backpropagation').first()
    if not existing_default_values:
        # Create a new instance of MyModel with default values
        default_model = Algorithm(
            name='Backpropagation',
            options='default',
            description='Backpropagation is short for backward propagation of errors.'
        )
        # Add the default model to the database
        db.session.add(default_model)
        db.session.commit()


# add_default_values_to_model()