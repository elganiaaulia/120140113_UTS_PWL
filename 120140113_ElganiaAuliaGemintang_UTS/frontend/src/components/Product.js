import React from "react";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";

const Product = (product, belanja) => {
  return (
    <Col md={4} xs={6} classname="mb-4">
      <Card className="shadow" onClick={() => belanja(product)}>
        <Card.Img variant="top" src={product.gambar} />
        <Card.Body>
          <Card.Title>{product.nama}</Card.Title>
          <Card.Text>RP. {product.harga} </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Product;
