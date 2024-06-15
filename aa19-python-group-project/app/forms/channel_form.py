from flask_wtf import FlaskForm
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Channel

def channel_exists(form, field):
    # Checking if channel name already exists in the server
    name = field.data
    server_id = form.server_id
    channel = Channel.query.filter(Channel.name == name, Channel.server_id == server_id).first()
    if channel:
        raise ValidationError('Channel name already exists in this server.')

class ChannelForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), Length(max=50), channel_exists])
