from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import Server


def unique_name(form, field):

    name = form.data['name']
    server = Server.query.filter(Server.name == name).first()
    if server:
        raise ValidationError('Server all ready exist with that name')


class CreateServerForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
