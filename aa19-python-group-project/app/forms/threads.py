from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired

class ThreadForm(FlaskForm):
    message_id = IntegerField('Message ID', validators=[DataRequired()])
