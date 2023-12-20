# -*- coding:utf-8 -*-
import uuid
from controllers.web import api
from flask import request, current_app
from flask_restful import Resource, reqparse
from werkzeug.exceptions import Unauthorized, NotFound
from models.model import Site, EndUser, App
from extensions.ext_database import db
from libs.passport import PassportService
import requests
import json

class PassportResource(Resource):
    """Base resource for passport."""
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True, nullable=False, location='json')
        parser.add_argument('password', type=str, required=True, nullable=False, location='json')
        args = parser.parse_args()
        url = current_app.config.get('BACKEND_API_URL') + '/system/login'
        headers = {'content-type': "application/json"}
        body = {"username":args['username'], "password":args['password']}
        response = requests.post(url, data = json.dumps(body), headers = headers)
        if response.status_code == 200:
            data = json.loads(response.text)
            if(data["code"] != 200):
                raise Unauthorized(data["message"])
        else:
            raise Unauthorized('登录错误')
        app_id = data['data']['app_id']
        # get site from db and check if it is normal
        site = db.session.query(Site).filter(
            Site.app_id == app_id,
            Site.status == 'normal'
        ).first()
        if not site:
            raise NotFound()
        # get app from db and check if it is normal and enable_site
        app_model = db.session.query(App).filter(App.id == site.app_id).first()
        if not app_model or app_model.status != 'normal' or not app_model.enable_site:
            raise NotFound()
        
        end_user = EndUser(
            tenant_id=app_model.tenant_id,
            app_id=app_model.id,
            type='browser',
            is_anonymous=True,
            session_id=args['username'],
        )
        db.session.add(end_user)
        db.session.commit()

        payload = {
            "iss": site.app_id,
            'sub': 'Web API Passport',
            'app_id': site.app_id,
            'app_code': site.code,
            'end_user_id': end_user.id,
        }

        tk = PassportService().issue(payload)

        return {
            'access_token': tk,
            'test': 'xxxxx',
        }

    def get(self):
            app_code = request.headers.get('X-App-Code')
            if app_code is None:
                raise Unauthorized('X-App-Code header is missing.')

            # get site from db and check if it is normal
            site = db.session.query(Site).filter(
                Site.code == app_code,
                Site.status == 'normal'
            ).first()
            if not site:
                raise NotFound()
            # get app from db and check if it is normal and enable_site
            app_model = db.session.query(App).filter(App.id == site.app_id).first()
            if not app_model or app_model.status != 'normal' or not app_model.enable_site or app_model.need_login:
                raise NotFound()

            end_user = EndUser(
                tenant_id=app_model.tenant_id,
                app_id=app_model.id,
                type='browser',
                is_anonymous=True,
                session_id=generate_session_id(),
            )
            db.session.add(end_user)
            db.session.commit()

            payload = {
                "iss": site.app_id,
                'sub': 'Web API Passport',
                'app_id': site.app_id,
                'app_code': app_code,
                'end_user_id': end_user.id,
            }

            tk = PassportService().issue(payload)

            return {
                'access_token': tk,
            }
api.add_resource(PassportResource, '/passport')

def generate_session_id():
    """
    Generate a unique session ID.
    """
    while True:
        session_id = str(uuid.uuid4())
        existing_count = db.session.query(EndUser) \
            .filter(EndUser.session_id == session_id).count()
        if existing_count == 0:
            return session_id
