from flask_wtf import FlaskForm
from wtforms import TextAreaField, IntegerField, StringField
from wtforms.validators import DataRequired, Length

class DirectMessageForm(FlaskForm):
    content = TextAreaField('Content', validators=[DataRequired(), Length(min=1, max=1000)])
    receiver_id = IntegerField('Receiver ID', validators=[DataRequired()])
    recipient_name = StringField('Recipient', validators=[DataRequired(message="Please Provide <username#number>"), Length(min=4)])
