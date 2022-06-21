import React from "react";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle
} from 'reactstrap';

const Dashboard = () => {
    return (
        <Card>
            <div className="p-3">
                <CardTitle><i className="mdi mdi-border-all mr-2"></i>Hoverable Rows</CardTitle>
                <CardSubtitle className="mb-0">Use <code>hover</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.</CardSubtitle>
            </div>
            <CardBody>
                <Row>
                    <Col md="12">
                            <Table bordered size="small" hover responsive>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                </tbody>
                            </Table>
                    </Col>
                </Row>
            </CardBody>
        </Card >
    );
}

export default Dashboard;
