from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.authorization import ACLAuthorizationPolicy
import pymysql
import jwt
import json
import datetime

# Koneksi ke database MySQL
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='uts_pwl',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# Route untuk read halaman belanja
@view_config(route_name='product', renderer='json')
def belanja(request):
     with connection.cursor() as cursor:
        sql = "SELECT * FROM product"
        cursor.execute(sql)
        data = cursor.fetchall()
        return {'data': data}

# Route untuk create data
@view_config(route_name='create-data', request_method='POST', renderer="json")
def belaja_create(request):
    # create data movies
    
        with connection.cursor() as cursor:
            sql = "INSERT INTO movies (nama, harga, desk, id) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (request.POST['nama'], request.POST['harga'],
                           request.POST['desk']))
            connection.commit()
        return {'message': 'ok', 'description': 'berhasil menambahkan data anda', 'data': [request.POST['nama'], request.POST['harga'], request.POST['desk']]}
   

# Route untuk halaman edit belanja
@view_config(route_name='keranjangkita', renderer='json')
def edit_belanja(request):
    id_belanja = request.matchdict.get('id_belanja')  # Ambil id dari parameter URL

    with connection.cursor() as cursor:
        # Ambil data film berdasarkan id_belanja
        sql = "SELECT * FROM keranjangkita WHERE id = %s"
        cursor.execute(sql, (id,))
        keranjangkita = cursor.fetchone()

    return {'keranjangkita': keranjangkita}

#  Route untuk delete data
@view_config(route_name='delete-data', request_method='DELETE', renderer="json")
def movie_delete(request):
    # delete data movies
        with connection.cursor() as cursor:
            sql = "SELECT * FROM product WHERE id=%s"
            cursor.execute(sql)
            result = cursor.fetchall()
            data = {}
            for item in result:
                data = {
                    'id': item['id'],
                    'nama': item['nama'],
                    'harga': item['harga'],
                    'desk': item['desk'],
                    
                }
            sql = "DELETE FROM product WHERE id=%s"
            cursor.execute(sql, (request.POST['id']))
            connection.commit()
        return {'message': 'ok', 'description': 'hapus data berhasil', 'data': data}


# Konfigurasi Pyramid
if __name__ == "__main__":
    with Configurator() as config:
        
        config.add_static_view(name='static', path='static')
        config.add_route('product', '/product')
        config.add_route('keranjangkita', '/kerajangs')
        config.add_route('edit_belanja', '/edit')
        config.add_route('delete_data', '/delete')
        config.scan()
        config.set_authorization_policy(ACLAuthorizationPolicy())
        config.include('pyramid_jwt')
        config.set_jwt_authentication_policy(config.get_settings()['jwt.secret'])
        app = config.make_wsgi_app()

    # Menjalankan aplikasi pada server lokal
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()