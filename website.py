import time
import os

from datetime import datetime

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
wd = os.path.dirname(os.path.realpath(__file__))
dbpath = os.path.join(wd, 'test.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + dbpath
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class WorkPeriod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.DateTime, nullable=False)
    end = db.Column(db.DateTime, nullable=False)
    workplace = db.Column(db.String(255), nullable=False)

    def get_start(self):
        return self.start.isoformat()

    def get_end(self):
        return self.end.isoformat()

if not os.path.exists(dbpath):
    db.create_all()


@app.route('/')
def index():
    workplaces = {"Comune Cles": "red",
                  "GSH": "green"}

    work_periods = WorkPeriod.query.all()

    return render_template('index.html',
                           copyright_date=time.strftime('%Y'),
                           workplaces=workplaces,
                           work_periods=work_periods)

@app.route('/newperiod/<int:start>/<int:end>/<string:workplace>')
def new_period(start, end, workplace):
    p = WorkPeriod(start=datetime.fromtimestamp(start),
                   end=datetime.fromtimestamp(end),
                   workplace=workplace)
    db.session.add(p)
    db.session.commit()
    return str(p.id)

@app.route('/chperiod/<int:id_>/<int:start>/<int:end>')
def change_period(id_, start, end):
    p = WorkPeriod.query.filter_by(id=id_).first()
    p.start = datetime.fromtimestamp(start)
    p.end = datetime.fromtimestamp(end)
    db.session.add(p)
    db.session.commit()
    return "OK"

@app.route('/editperiod/<int:id_>/<int:start>/<int:end>/<string:workplace>')
def edit_period(id_, start, end, workplace):
    p = WorkPeriod.query.filter_by(id=id_).first()
    p.start = datetime.fromtimestamp(start)
    p.end = datetime.fromtimestamp(end)
    p.workplace = workplace
    db.session.add(p)
    db.session.commit()
    return "OK"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
