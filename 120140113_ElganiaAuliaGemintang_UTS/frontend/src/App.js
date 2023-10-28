import "./App.css";
import React, { Component } from "react";
import Navbarcomponent from "./components/Nabvar";
import Hasil from "./components/hasil";
import { Row, Col } from "react-bootstrap";
import { API_URL } from "./util/constants";
import Product from "./components/Product";
import axios from "axios";
import swal from "sweetalert";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_list: [],
      keranjangkita: [],
    };
  }
  // fungsi untuk menampilkan list product
  componentDidMount() {
    axios
      .get(API_URL + "product")
      .then((res) => {
        const product_list = res.data;
        this.setState({ product_list });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(API_URL + "keranjangkita")
      .then((res) => {
        const keranjangkita = res.data;
        this.setState({ keranjangkita });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // fungsi untuk belanja
  belanja = (value) => {
    // get
    axios
      .get(API_URL + "keranjangkita?product.id=" + value.id)
      .then((res) => {
        if (res.data.length === 0) {
          // simpan daftar belanja untuk product yang belum dibeli
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
          };

          axios
            .post(API_URL + "keranjangkita", keranjang)
            .then((res) => {
              // Notifikasi berhasil menambahkan ke keranjang
              swal({
                title: "Berhasil Ditambahkan",
                text: "Berhasil Ditambahkan" + keranjang.product.nama,
                icon: "success",
                button: false,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // simpan daftar belanja jika pruduct sebelumnya sudah ditambahkan
          const keranjang = {
            jumlah: res.data[0].jumlah + 1,
            total_harga: res.data[0].total_harga + value.harga,
            product: value,
          };

          axios
            .put(API_URL + "keranjangkita/" + res.data[0].id, keranjang)
            .then((res) => {
              // Notifikasi berhasil menambahkan ke keranjang
              swal({
                title: "Berhasil Ditambahkan",
                text: "Berhasil Ditambahkan" + keranjang.product.nama,
                icon: "success",
                button: false,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    console.log(this.state.product_list);
    const { product_list, keranjangkita } = this.state;
    return (
      <div className="App">
        <Navbarcomponent />
        <div className="mt-3">
          <Row>
            <Col>
              <h4> Daftar Produk </h4>
              <Row>{product_list && product_list.map((product) => <Product key={product.id} product={product} belanja={this.belanja} />)}</Row>
            </Col>
            <Hasil keranjangkita={keranjangkita} />
          </Row>
        </div>
      </div>
    );
  }
}
